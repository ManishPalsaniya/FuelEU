# ⚡ Fuel EU Compliance Dashboard

A modern, full-stack maritime emissions tracking and compliance management system built with **React**, **Node.js**, **TypeScript**, and **Prisma**. This application helps shipping companies monitor and manage their compliance with EU FuelEU Maritime regulations.

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![React](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node-20-green) ![Prisma](https://img.shields.io/badge/Prisma-5.0-blue)

## 🚀 Live Demo
- **Frontend:** [https://fuel-eu.vercel.app/](https://fuel-eu.vercel.app/) (Example)
- **Backend API:** [https://fuel-eu-backend.onrender.com](https://fuel-eu-backend.onrender.com) (Example)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## ✨ Features

### Core Functionality
- **🚢 Route Management:** Track and analyze maritime routes with GHG intensity calculations
- **📊 Compliance Monitoring:** Real-time compliance balance (CB) calculations per ship and year
- **🏦 Banking System:** Bank surplus emissions and apply them to deficit periods
- **💧 Pooling:** Create compliance pools to redistribute emissions across multiple vessels
- **📈 Comparison Dashboard:** Compare routes against baseline and target intensities

### Technical Features
- **✅ Real-time Data:** Live updates via API
- **📱 Mobile Responsive:** Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI:** Glassmorphism design with "Dark Slate" theme
- **🔒 Type-Safe:** Full TypeScript implementation
- **🏗️ Hexagonal Architecture:** Clean separation of concerns
- **🌐 RESTful API:** Well-documented endpoints
- **🔄 CORS Enabled:** Cross-origin resource sharing configured

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Next.js) with TypeScript
- **Build Tool:** Vite / Next.js Compiler
- **Styling:** Tailwind CSS with custom dark theme
- **Components:** `shadcn/ui`
- **State Management:** React Server Components & Actions
- **HTTP Client:** Fetch API / Axios
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express 5.1
- **Language:** TypeScript 5.9
- **ORM:** Prisma 5.0
- **Database:** PostgreSQL (Production) / SQLite (Dev)
- **Architecture:** Hexagonal (Ports & Adapters)
- **Deployment:** Render

### Development Tools
- **Package Manager:** npm
- **Linting:** ESLint
- **Version Control:** Git & GitHub
- **API Testing:** Postman

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (also known as Ports and Adapters pattern) for the backend, ensuring clean separation of concerns and testability.

### Backend Architecture
```
backend/
├── src/
│   ├── core/                    # Business Logic (Domain Layer)
│   │   ├── domain/
│   │   │   ├── Entities.ts      # Domain entities
│   │   │   └── Formulas.ts      # Compliance calculations
│   │   ├── application/
│   │   │   ├── BankingUseCase.ts
│   │   │   └── ComplianceUseCase.ts
│   │   └── ports/
│   │       └── Repositories.ts  # Repository interfaces
│   │
│   ├── adapters/                # Adapters Layer
│   │   ├── inbound/             # Inbound Adapters (Controllers)
│   │   │   └── http/
│   │   │       ├── BankingController.ts
│   │   │       └── ComplianceController.ts
│   │   │
│   │   └── outbound/            # Outbound Adapters (Repositories)
│   │       └── postgres/
│   │           ├── BankingRepository.impl.ts
│   │           └── ComplianceRepository.impl.ts
│   │
│   └── infrastructure/          # Framework & Config
│       └── server.ts
```

### Key Architectural Principles:
- **✅ Domain-Driven Design:** Business logic isolated in the core
- **✅ Dependency Inversion:** Core depends on abstractions, not implementations
- **✅ Testability:** Easy to mock and test each layer independently
- **✅ Flexibility:** Easy to swap Database implementations via Prisma

## 🚀 Getting Started

### Prerequisites
- **Node.js:** 20.x or higher
- **npm:** 10.x or higher
- **Database:** PostgreSQL (or SQLite for dev)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ManishPalsaniya/FuelEU.git
    cd FuelEU
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    # Generate Prisma Client
    npx prisma generate
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../src  # or root depending on structure
    npm install
    ```

### Configuration

#### Backend Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/fueleu_db"
```

### Running Locally

1.  **Start Backend**
    ```bash
    cd backend
    npm run dev
    ```
    Backend will run on `http://localhost:3001`

2.  **Start Frontend**
    ```bash
    # From root
    npm run dev
    ```
    Frontend will run on `http://localhost:3000`

## 🌐 Deployment

### Backend Deployment (Render)
1.  **Push to GitHub**
2.  **Create Render Web Service**
    -   Build Command: `npm install && npm run build`
    -   Start Command: `npm start`
3.  **Environment Variables:** Set `DATABASE_URL`

### Frontend Deployment (Vercel)
1.  **Import GitHub Repository**
2.  **Configure Build:**
    -   Framework: Next.js / Vite
    -   Build Command: `npm run build`
3.  **Deploy**

## 📚 API Documentation

### Base URL
- **Production:** `https://fuel-eu-backend.onrender.com/api`
- **Local:** `http://localhost:3001/api`

### Endpoints

#### Routes
- `GET /routes` - Get all routes
- `GET /routes/:id` - Get route by ID
- `POST /routes/:id/baseline` - Set route as baseline

#### Compliance
- `GET /compliance/cb?year=YYYY` - Get compliance for year
- `GET /compliance/adjusted-cb?year=YYYY` - Get adjusted CB for year
- `POST /compliance/cb/:shipId/:year` - Calculate compliance

#### Banking
- `POST /banking/bank` - Bank surplus emissions
- `POST /banking/apply` - Apply banked surplus
- `GET /banking/records` - Get banking history

#### Pooling
- `POST /pools` - Create compliance pool
- `GET /pools/:poolId/members` - Get pool members

## 🧪 Testing

### Run Tests
```bash
# Frontend
npm run test

# Backend
cd backend
npm run test
```

### API Testing with Postman
- **Health Check:** `GET /health`
- **Get Routes:** `GET /routes`
- **Bank Surplus:** `POST /banking/bank`

## 📁 Project Structure

```
fuel-eu/
├── backend/                 # Backend API (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── core/           # Business logic
│   │   ├── adapters/       # Controllers & Repositories
│   │   └── infrastructure/ # Server & DB config
│   ├── prisma/             # Database schema
│   └── package.json
│
├── src/                     # Frontend App (Next.js)
│   ├── app/                # App Router pages
│   ├── components/         # UI Components
│   ├── lib/                # Utilities & Server Actions
│   └── package.json
│
├── AGENT_WORKFLOW.md        # Development workflow documentation
├── README.md                # This file
└── REFLECTION.md            # Technical decisions and learnings
```

## 🔑 Key Technical Decisions

### Why Prisma?
- **Type Safety:** Prisma generates a fully type-safe client based on the schema.
- **Relational Data:** Maritime data (Ships, Routes, Logs) fits well into a relational model.
- **Migrations:** Robust migration system for evolving schemas.

### Why Hexagonal Architecture?
- **Testability:** Easy to mock repositories and test business logic
- **Flexibility:** Can swap database providers without changing core logic
- **Maintainability:** Clear separation between business rules and infrastructure

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

**Manish Palsaniya**
- Email: [palsaniyamanish325@gmail.com](mailto:palsaniyamanish325@gmail.com)

## 🙏 Acknowledgments

- EU FuelEU Maritime Regulation guidelines
- Prisma for database ORM
- Vercel for frontend hosting
- React and Next.js communities

---
Built with ⚡ by **Manish Palsaniya**
