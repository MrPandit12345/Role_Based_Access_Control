## Role-Based Access Control System with Enterprise Management

A full-stack **Role-Based Access Control (RBAC)** system. 
Built with **React.js**, **Node.js (Express)**, and **NoSql**.

##  ⚙️ Features

User authentication with JWT

Role-based permissions (CRUD for roles, users, products, etc.)

Enterprise and employee management

Automatic creation of Admin role and Admin user

RESTful API with Express.js

React.js frontend with Axios for API calls

CORS enabled for frontend-backend communication

## ⚙️ Setup Instructions

### Clone the Repository
```bash
git clone <your-repo-url>
cd project-root
```

#### Create `.env` file
Copy from `.env.example` and configure your own credentials:
```bash
cp .env.example .env
```

### Backend Setup (`server/`)
```bash
cd server
npm install
npm run dev
```

### Frontend Setup (`frontend/`)
```bash
cd frontend
npm install
npm start
```
