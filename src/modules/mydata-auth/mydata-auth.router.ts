import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { BankAuthController } from './mydata-auth.controller';

// Validation helpers
const validateRequiredFields = (body: any, fields: string[]): string[] => 
  fields.filter(field => !body[field]);

// Middleware functions with correct return types
const validateContentType: RequestHandler = (req, res, next): void => {
  if (!req.headers['content-type']?.includes('application/json')) {
    res.status(400).json({
      rsp_code: '40001',
      rsp_msg: 'Invalid content type. Must be application/json'
    });
    return;
  }
  next();
};

const validateTransactionId: RequestHandler = (req, res, next): void => {
  if (!req.headers['x-api-tran-id']) {
    res.status(400).json({
      rsp_code: '40002',
      rsp_msg: 'Missing x-api-tran-id header'
    });
    return;
  }
  next();
};

const validateBaseFields: RequestHandler = (req, res, next): void => {
  const requiredFields = ['tx_id', 'org_code', 'grant_type', 'client_id', 'client_secret'];
  const missingFields = validateRequiredFields(req.body, requiredFields);

  if (missingFields.length > 0) {
    res.status(400).json({
      rsp_code: '40003',
      rsp_msg: `Missing required fields: ${missingFields.join(', ')}`
    });
    return;
  }
  next();
};

const validateGrantType: RequestHandler = (req, res, next): void => {
  const { grant_type, username, password, consent, refresh_token } = req.body;

  if (grant_type === 'password') {
    if (!username || !password || !consent) {
      res.status(400).json({
        rsp_code: '40004',
        rsp_msg: 'Missing required fields for password grant type'
      });
      return;
    }
  } else if (grant_type === 'refresh_token') {
    if (!refresh_token) {
      res.status(400).json({
        rsp_code: '40005',
        rsp_msg: 'Missing refresh token'
      });
      return;
    }
  } else {
    res.status(400).json({
      rsp_code: '40006',
      rsp_msg: 'Invalid grant type'
    });
    return;
  }
  next();
};

// Request handler with correct return type
const handleTokenRequest = (authController: BankAuthController): RequestHandler => 
  async (req, res, next): Promise<void> => {
    try {
      const { grant_type } = req.body;
      
      if (grant_type === 'password') {
        await authController.issueAccessToken(req, res);
      } else if (grant_type === 'refresh_token') {
        await authController.refreshToken(req, res);
      }
    } catch (error) {
      console.error('Token request failed:', error);
      res.status(500).json({
        rsp_code: '50000',
        rsp_msg: 'Internal server error'
      });
    }
  };

// Router factory
export const createBankAuthRouter = (authController: BankAuthController): Router => {
  const router = Router();
  
  router.post(
    '/oauth/2.0/token',
    validateContentType,
    validateTransactionId,
    validateBaseFields,
    validateGrantType,
    handleTokenRequest(authController)
  );

  return router;
};