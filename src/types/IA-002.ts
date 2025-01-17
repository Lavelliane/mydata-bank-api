// Types for MyData Access Token Request (Integrated Authentication-002)

export interface MyDataAccessTokenRequest {
  // Transaction ID (Required)
  // Format: MD_[MyData business operator code(10)]_[Information provider code(10)]_[Relay agency code(10)]_
  // [Certification agency code(10)]_[Request time(YYYYMMDDHHMMSS)(14)]_[Serial number(12)]
  tx_id: string;

  // Information provider code (Required)
  // Code assigned when registering the institution in the integrated portal
  org_code: string;

  // Authorization method (Required)
  // Fixed value: 'password'
  grant_type: 'password';

  // Client ID (Required)
  // Issued when registering MyData service on the comprehensive portal
  client_id: string;

  // Client Secret (Required)
  // Issued when registering MyData service for additional security verification
  client_secret: string;

  // Integrated Certification Authority Code (Required)
  // Institution code of the integrated certification agency
  ca_code: string;

  // Customer CI Information (Required)
  username: string;

  // Transmission request type (Required)
  // 0: Request to transfer asset list inquiry (1st)
  // 1: Request to transfer details for customer-selected assets (2nd)
  request_type: '0' | '1';

  // Length of electronic signature (Required)
  password_len: number;

  // Electronic signature of transmission request (Required)
  // CMS SignedData, Base64 url-safe encoding
  password: string;

  // Whether to use identity verification (Required)
  // 0: Use of identity verification agency
  // 1: Use of electronic signature certification business operator
  auth_type: '0' | '1';

  // Electronic Signature Types (Required)
  // 0: Sign the original transmission request details (default for identity verification agencies)
  // 1: Sign the hash value of the transmission request details (default for electronic signature certification providers)
  consent_type: '0' | '1';

  // Consent item length (Optional)
  // Required only when consent_type is 1
  consent_len?: number;

  // Transmission request details (Required)
  // UTF-8 encoded original text when consent_type is 1
  consent: string;

  // Length of electronic signature item for consent (Optional)
  // Apply only when auth_type is 0
  signed_person_info_req_len?: number;

  // Electronic signature for consent to use identity verification (Optional)
  // Required only when auth_type is 0
  // CMS SignedData, Base64 url-safe encoding
  signed_person_info_req?: string;

  // Replay attack prevention information 1 (Optional)
  // Required only when auth_type is 0
  consent_nonce?: string;

  // Replay Attack Prevention Information 2 (Optional)
  // Required only when auth_type is 0
  ucpid_nonce?: string;

  // Authenticator Transaction ID (Optional)
  // Required only when auth_type is 1
  cert_tx_id?: string;

  // Service Number (Optional)
  // Required for transmission between institutions
  // Format: [institution code (10 digits)][registration date (8 digits)][serial number (4 digits)]
  service_id?: string;
}


// Types for MyData Access Token Response (Integrated Authentication-002)

// Header interface for all MyData responses
export interface MyDataResponseHeader {
  // Transaction ID Number (Required)
  'x-api-tran-id': string;
}

export interface MyDataAccessTokenResponse {
  // Authentication Request Number (Required)
  // Same tx_id included in API request
  tx_id: string;

  // Access token type (Required)
  // Fixed value: 'Bearer'
  token_type: 'Bearer';

  // Issued Access Token (Required)
  access_token: string;

  // Access token validity period in seconds (Required)
  expires_in: number;

  // Token for access token renewal (Required)
  refresh_token: string;

  // Refresh token validity period in seconds (Required)
  refresh_token_expires_in: number;

  // Access token scope - multiple scopes possible (Required)
  scope: string;
}

// Error response interface
export interface MyDataErrorResponse {
  // Detailed response code
  rsp_code: string;

  // Detailed response message
  rsp_msg: string;
}

// Combined type for handling both success and error responses
export type MyDataTokenResponse = {
  header: MyDataResponseHeader;
  body: MyDataAccessTokenResponse | MyDataErrorResponse;
};