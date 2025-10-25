# RealX - Real Estate Tokenization Platform

![License](https://img.shields.io/badge/License-Proprietary-red.svg)
![Backend](https://img.shields.io/badge/Backend-Bun%2BTypeScript-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-React%2BTypeScript-blue.svg)
![Blockchain](https://img.shields.io/badge/Blockchain-Solana-purple.svg)

RealX is a comprehensive real estate tokenization platform that enables users to convert physical real estate properties into digital NFTs on the Solana blockchain, facilitating fractional ownership and secure trading of real estate assets.

## 🏗️ Project Architecture

The project consists of three main components:

- **Backend API** (`/backend`) - Bun + Express.js + MongoDB + Solana integration
- **Frontend Web App** (`/frontend`) - React + TypeScript + Vite + Tailwind CSS
- **Blockchain Layer** - Solana NFT tokenization with Metaplex integration

## ✨ Key Features
<!-- Keep features in sync with actual routes and UI capabilities -->

### 🏠 Real Estate Management
- **Multi-Asset Type Support**: Apartments, Houses, Garages, Parking, Land, Commercial, Business, Industrial
- **Complete Asset Lifecycle**: Draft → Government Approval → Tokenization → Active Trading
- **Geographic Integration**: Interactive maps for property location selection
- **Media Management**: Property photos and document uploads via S3

### 🔗 Blockchain Tokenization
- **Solana NFT Integration**: Convert approved properties to SPL Token 2022 NFTs
- **Collection Management**: Unified "RealX NFT Collection" with sequential numbering
- **Wallet Integration**: Support for Phantom and other Solana wallets

### 👥 Multi-Role System
- **Users**: Property owners and investors
- **Government Officials**: Asset approval authorities
- **Administrators**: Platform and KYC management
- **Automated Workflows**: Status tracking and validation

### 🛡️ Compliance & Security
- **KYC Verification**: Document-based identity verification
- **Government Approval**: Official validation workflow for properties
- **Multi-Signature**: Combined user and platform signatures for transactions
- **Audit Trail**: Complete transaction and status history

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) runtime
- [Node.js](https://nodejs.org/) 18+
- MongoDB database
- AWS S3 bucket for file storage
- Solana RPC endpoint

### Backend Setup

```bash
cd backend

# Install dependencies
bun install

# Configure environment
cp .env.sample .env
# Edit .env with your configuration

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## 🏛️ Architecture Details

### Backend Structure

```
backend/src/
├── blockchain/          # Solana integration & NFT operations
│   ├── @soltools/      # Custom Solana utility library
│   ├── umi.ts          # UMI framework configuration
│   └── generate_collection.ts
├── modules/            # Feature modules
│   ├── auth/          # JWT authentication & Google OAuth
│   ├── real_assets/   # Property CRUD & approval workflow
│   ├── crypto_assets/ # NFT tokenization & management
│   ├── kyc/          # Identity verification
│   └── upload/       # File upload to S3
├── codegen/          # Auto-generated types & models
└── controller.ts     # Central API controller
```
<!-- NOTE: codegen output is generated; do not edit manually -->

### Frontend Structure

```
frontend/src/
├── sections/         # Main application sections
│   ├── auth/        # Authentication screens
│   ├── explore/     # Property browsing
│   ├── my_real_assets/  # Asset management
│   ├── my_crypto_assets/ # NFT portfolio
│   ├── admin_kyc/   # KYC administration
│   └── gov_approvals/   # Government workflows
├── components/      # Reusable UI components
│   ├── ui/         # Shadcn/UI components
│   └── custom/     # Custom components
└── codegen/        # Generated API types
```

### Asset Lifecycle

```
Draft → PendingApprovalByGov → ApprovedByGov → TokenizationInProgress → Active
                    ↓                            ↓
              RejectedByGov               BlockchainError
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Bun
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Google OAuth
- **Blockchain**: Solana Web3.js + UMI + Metaplex
- **Storage**: AWS S3
- **File Processing**: Image resizing and validation

### Frontend
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: Nanostores + Cubit pattern
- **Routing**: React Router v7
- **Maps**: Leaflet + React Leaflet
- **Blockchain**: Solana Wallet Adapter

### Blockchain
- **Network**: Solana (configurable: devnet/testnet/mainnet)
- **Token Standard**: SPL Token 2022
- **NFT Framework**: Metaplex UMI
- **Collection**: Single master collection with verified NFTs
- **Metadata**: Dynamic JSON metadata for each property

## 📊 API Reference
<!-- OpenAPI spec auto-generated: /backend/codegen/openapi.json (bun run codegen) -->

### Authentication Endpoints
```
POST /api/auth/google-sign-in      # Google OAuth login
POST /api/auth/google-sign-up      # Google OAuth registration
POST /api/auth/jwt-refresh         # JWT token refresh
POST /api/auth/sign-out           # User logout
```

### Real Asset Management
```
GET    /api/user/real-asset-list           # Get user's properties
POST   /api/user/create-real-asset         # Create new property
PUT    /api/user/update-real-asset/:uuid   # Update property
POST   /api/user/submit-real-asset-for-approval/:uuid  # Submit for approval
DELETE /api/user/archive-real-asset/:uuid  # Archive property
```

### Government Approval
```
GET  /api/gov/real-asset-approval-list  # Get pending approvals
POST /api/gov/approve-real-asset/:uuid  # Approve property
POST /api/gov/reject-real-asset/:uuid   # Reject property
```

### Tokenization
```
POST /api/user/tokenize-real-asset          # Initiate tokenization
POST /api/user/tokenize-real-asset-confirm  # Confirm tokenization
GET  /api/user/crypto-asset-list           # Get tokenized assets
```

### Metadata Endpoints
```
GET /api/meta/collection.json           # NFT collection metadata
GET /api/meta/{nft_no}/metadata.json   # Individual NFT metadata
```

## ⚙️ Environment Configuration

### Backend Environment Variables

```env
# Database
DB_CONNECT_STRING=mongodb://localhost:27017/realx

# Server
PORT=3028
NODE_ENV=development

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=realx-uploads

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Solana
SOLANA_CLUSTER=devnet
SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
APP_PRIVATE_KEY=your_solana_private_key
```

### Frontend Configuration

The frontend automatically proxies API requests to `http://0.0.0.0:3028` during development. For production, ensure the API base URL is properly configured.
<!-- Configure API base via env at build time; avoid hard-coded URLs -->

## 🔐 Security Features

### Authentication & Authorization
- **JWT-based authentication** with refresh token rotation
- **Google OAuth integration** for secure social login
- **Role-based access control** (User, Admin, Government)
- **Session management** with automatic token refresh

### Blockchain Security
- **Multi-signature transactions** requiring both user and platform approval
- **Deterministic key generation** preventing collisions
- **Environment variable protection** for private keys
- **Transaction validation** before blockchain submission

### Data Protection
- **Input validation** and sanitization
- **File type restrictions** for uploads
- **Image processing** and size limits
- **CORS configuration** for API security

## 📈 Development Workflow

## 🐛 Known Issues

- Development environment uses HTTPS with local certificates
- Some blockchain operations may require manual confirmation
- S3 upload configuration is environment-specific

##📄 License

- This software is proprietary. All rights reserved.

---
