
# Money Tracker API

A modern, high-performance REST API for personal finance management built with TypeScript, Fastify, and Prisma. Track your expenses, income, accounts, and financial transactions with a robust and scalable backend solution.

## 🎯 What is Money Tracker API?

Money Tracker API is a comprehensive personal finance management system that helps users:

- **Track Transactions**: Record income and expenses across multiple accounts
- **Manage Accounts**: Support for various account types (Cash, Bank, Credit, Investment, Crypto)
- **Categorize Spending**: Organize transactions with custom categories for better insights
- **Multi-Currency Support**: Handle transactions in different currencies (USD, EUR, RUB, GBP, etc.)
- **Payee Management**: Track who you pay and receive money from
- **User Authentication**: Secure JWT-based authentication with role-based access
- **Health Monitoring**: Built-in health checks and Prometheus metrics for production monitoring

## ✨ Key Features

### Core Functionality
- 💰 **Transaction Management**: Create, update, and track income/expense transactions
- 🏦 **Multi-Account Support**: Manage cash, bank, credit, investment, and crypto accounts
- 📊 **Categories & Payees**: Organize transactions with custom categories and payee tracking
- 💱 **Multi-Currency**: Handle multiple currencies with proper decimal precision
- 🔐 **Secure Authentication**: JWT-based auth with user roles (USER, ADMIN)

### Technical Features
- 🚀 **High Performance**: Built on Fastify for maximum speed
- 📝 **API Documentation**: Auto-generated Swagger/OpenAPI docs
- ✅ **Input Validation**: Zod schemas for type-safe request/response handling
- 🔒 **Security**: Helmet for security headers, CORS support
- 📈 **Monitoring**: Prometheus metrics and health endpoints
- 🧪 **Testing**: Comprehensive test suite with Vitest
- 🎨 **Code Quality**: ESLint + Prettier for consistent code style

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js with TypeScript
- **Web Framework**: Fastify (high-performance alternative to Express)
- **Database**: Prisma ORM (supports PostgreSQL, MySQL, SQLite)
- **Validation**: Zod for runtime type checking
- **Authentication**: JWT tokens with @fastify/jwt
- **Documentation**: Swagger/OpenAPI with @fastify/swagger
- **Testing**: Vitest with coverage reporting
- **Package Manager**: pnpm

### Data Model
The API manages several core entities:
- **Users**: Authentication and user management with roles
- **Accounts**: Financial accounts with different types and currencies
- **Categories**: Income/expense categorization system
- **Payees**: Entities that receive or send money
- **Transactions**: Financial transactions linking accounts, categories, and payees

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- Database (PostgreSQL/MySQL/SQLite)