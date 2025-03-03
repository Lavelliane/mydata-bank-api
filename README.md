﻿# MyData Bank API

## Overview
The MyData Bank API is a secure and efficient API designed to handle authentication and authorization for banking applications. It provides endpoints for issuing access tokens and refreshing tokens, ensuring secure access to banking services.

## Features
- **OAuth 2.0 Token Endpoint**: Supports password and refresh token grant types.
- **Secure**: Implements robust validation and error handling mechanisms.
- **Extensible**: Easily extendable to support additional grant types and authentication mechanisms.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/mydata-bank-api.git
   ```
2. Navigate to the project directory:
   ```sh
   cd mydata-bank-api
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

### Configuration
1. Create a `.env` file in the root directory and add the following environment variables:
   ```sh
   BANK_ORG_CODE=
   JWT_SECRET_KEY=
   MYDATA_CLIENT_ID=
   MYDATA_CLIENT_SECRET=
   MYDATA_PUBLIC_KEY=
   ```

### Running the Application
1. Compile the TypeScript code:
   ```sh
   npm run build
   ```
2. Start the application:
   ```sh
   npm start
   ```
3. For development mode with hot-reloading:
   ```sh
   npm run dev
   ```

## API Endpoints

### POST /oauth/2.0/token
#### Description
Handles token requests for password and refresh token grant types.

#### Request Body
- `grant_type`: The type of grant being requested (`password` or `refresh_token`).
- `username`: (Required for `password` grant type) The user's username.
- `password`: (Required for `password` grant type) The user's password.
- `consent`: (Required for `password` grant type) User's consent.
- `refresh_token`: (Required for `refresh_token` grant type) The refresh token.

#### Responses
- `200 OK`: Token issued successfully.
- `400 Bad Request`: Missing required fields or invalid grant type.
- `500 Internal Server Error`: An error occurred on the server.

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact
For any questions or support, please contact [lavelliane@kookmin.ac.kr].
