# Scandiweb E-commerce Application

A full-stack e-commerce application built with React and PHP, featuring a GraphQL API, hosted [here]([url](https://darko-site.rf.gd)).

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

1. Clone the repository into your XAMPP's htdocs folder
```bash
cd /path/to/xampp/htdocs
git clone [repository-url] scandiweb
```

2. Copy `.env.example` to `.env` and configure your database credentials:
```bash
DB_HOST=localhost
DB_NAME=scandi_base
DB_USER=root
DB_PASS=
```

3. Import database schema using phpMyAdmin:
- Open `http://localhost/phpmyadmin`
- Create a new database named `scandi_base`
- Import `scandi_base.sql`

4. Install backend dependencies:
```bash
composer install
```

5. Install frontend dependencies:
```bash
cd client
npm install
```

6. Start the servers:
- Start Apache and MySQL from XAMPP Control Panel
- Start the React development server:
```bash
cd client
npm start
```

Backend will be available at `http://localhost/scandiweb`  
Frontend will be available at `http://localhost:3000`
