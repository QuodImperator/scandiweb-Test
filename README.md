# Scandiweb E-commerce Application

A full-stack e-commerce application built with React and PHP, featuring a GraphQL API.

## Features

- Product catalog with categories
- Product details with configurable attributes
- Shopping cart functionality
- Order placement system
- Responsive design

## Tech Stack

### Frontend
- React 18
- Apollo Client
- React Router
- CSS3

### Backend
- PHP 7.4+
- GraphQL (webonyx/graphql-php)
- MySQL

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your database credentials
3. Import database schema:
```bash
mysql -u your_user -p your_database < scandi_base.sql
```

4. Install backend dependencies:
```bash
composer install
```

5. Install frontend dependencies:
```bash
cd client
npm install
```

6. Start the development servers:
```bash
# Backend (from root directory)
php -S localhost:8000 -t public

# Frontend (from client directory)
npm start
```

Visit `http://localhost:3000` to view the application.