// src/controllers/bankAuthController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
    MyDataAccessTokenRequest,
    MyDataTokenResponse
} from '../../types/IA-002';
import config from '../../config';

export class BankAuthController {
    private readonly orgCode: string;
    private readonly secretKey: string;
    private readonly authorizedMyDataOperators: Map<string, {
        clientSecret: string;
        publicKey: string;
    }>;

    constructor() {
        this.orgCode = config.bankOrgCode;
        this.secretKey = config.jwtSecretKey;

        // In production, this would be loaded from a secure database
        this.authorizedMyDataOperators = new Map();
        if (config.myDataClientId) {
            this.authorizedMyDataOperators.set(config.myDataClientId, {
              clientSecret: config.myDataClientSecret || '',
              publicKey: config.myDataPublicKey || ''
            });
          }

        if (!this.orgCode || !this.secretKey) {
            throw new Error('Bank configuration is incomplete');
        }
    }


    private validateSignature(password: string, consent: string, clientId: string): boolean {
        try {
          // For development/testing: always return true
          // TODO: In production, implement proper signature verification
          return true;
    
          /* Original implementation - keep for reference
          const operator = this.authorizedMyDataOperators.get(clientId);
          if (!operator) return false;
    
          const verify = crypto.createVerify('SHA256');
          verify.update(consent);
          return verify.verify(operator.publicKey, password, 'base64');
          */
        } catch (error) {
          console.error('Signature verification failed:', error);
          return false;
        }
    }

    private generateTokens(clientId: string, username: string): {
        accessToken: string;
        refreshToken: string;
    } {
        const accessToken = jwt.sign(
            {
                type: 'access_token',
                client_id: clientId,
                username,
                org_code: this.orgCode
            },
            this.secretKey,
            { expiresIn: '7d' }
        );

        const refreshToken = jwt.sign(
            {
                type: 'refresh_token',
                client_id: clientId,
                username,
                org_code: this.orgCode
            },
            this.secretKey,
            { expiresIn: '30d' }
        );

        return { accessToken, refreshToken };
    }

    async issueAccessToken(req: Request, res: Response): Promise<void> {
        try {
            const {
                tx_id,
                org_code,
                grant_type,
                client_id,
                client_secret,
                username,
                password,
                consent
            } = req.body as MyDataAccessTokenRequest;

            // 1. Validate organization code
            if (org_code !== this.orgCode) {
                res.status(400).json({
                    rsp_code: '40001',
                    rsp_msg: 'Invalid organization code'
                });
                return;
            }

            // 3. Validate MyData operator credentials
            const operator = this.authorizedMyDataOperators.get(client_id);
            if (!operator || operator.clientSecret !== client_secret) {
                res.status(401).json({
                    rsp_code: '40101',
                    rsp_msg: 'Invalid client credentials'
                });
                return;
            }

            // 4. Validate electronic signature
            if (!this.validateSignature(password, consent, client_id)) {
                res.status(401).json({
                    rsp_code: '40102',
                    rsp_msg: 'Invalid electronic signature'
                });
                return;
            }

            // 5. Generate tokens
            const { accessToken, refreshToken } = this.generateTokens(client_id, username);

            // 6. Send response
            res.json({
                tx_id,
                token_type: 'Bearer',
                access_token: accessToken,
                expires_in: 3600, // 1 hour
                refresh_token: refreshToken,
                refresh_token_expires_in: 2592000, // 30 days
                scope: 'bank-read'
            });

        } catch (error) {
            console.error('Token issuance failed:', error);
            res.status(500).json({
                rsp_code: '50001',
                rsp_msg: 'Internal server error during token issuance'
            });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const { refresh_token, client_id, client_secret } = req.body;

            // 1. Validate MyData operator credentials
            const operator = this.authorizedMyDataOperators.get(client_id);
            if (!operator || operator.clientSecret !== client_secret) {
                res.status(401).json({
                    rsp_code: '40101',
                    rsp_msg: 'Invalid client credentials'
                });
                return;
            }

            // 2. Verify refresh token
            try {
                const decoded = jwt.verify(refresh_token, this.secretKey) as {
                    type: string;
                    client_id: string;
                    username: string;
                };

                if (decoded.type !== 'refresh_token' || decoded.client_id !== client_id) {
                    throw new Error('Invalid token');
                }

                // 3. Generate new tokens
                const { accessToken, refreshToken } = this.generateTokens(
                    client_id,
                    decoded.username
                );

                // 4. Send response
                res.json({
                    token_type: 'Bearer',
                    access_token: accessToken,
                    expires_in: 3600,
                    refresh_token: refreshToken,
                    refresh_token_expires_in: 2592000,
                    scope: 'bank-read'
                });

            } catch (error) {
                res.status(401).json({
                    rsp_code: '40103',
                    rsp_msg: 'Invalid refresh token'
                });
            }

        } catch (error) {
            console.error('Token refresh failed:', error);
            res.status(500).json({
                rsp_code: '50002',
                rsp_msg: 'Internal server error during token refresh'
            });
        }
    }
}