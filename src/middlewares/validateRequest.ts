import { Request, Response, NextFunction } from 'express';
import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv({ allErrors: true });

export const validateRequest = (schema: object) => {
  const validate = ajv.compile(schema);
  
  return (req: Request, res: Response, next: NextFunction): void => {
    const valid = validate(req.body);
    
    if (!valid) {
      res.status(400).json({
        rsp_code: '40001',
        rsp_msg: 'Invalid request parameters',
        errors: validate.errors
      });
      return;
    }
    
    next();
  };
};