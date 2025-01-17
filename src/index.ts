import express from 'express';
import { createBankAuthRouter } from './modules/mydata-auth/mydata-auth.router';
import { BankAuthController } from './modules/mydata-auth/mydata-auth.controller';

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // For application/x-www-form-urlencoded
app.use(express.json()); // For application/json

// Initialize controllers
const authController = new BankAuthController();

// Initialize routers
const bankAuthRouter = createBankAuthRouter(authController);


// usages
app.use('/auth', bankAuthRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bank API server running on port ${PORT}`);
});