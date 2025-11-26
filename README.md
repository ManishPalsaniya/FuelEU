# ⚡ Fuel EU Compliance Dashboard

A modern, full-stack maritime emissions tracking and compliance management system built with **React**, **Node.js**, **TypeScript**, and **Prisma**. This application is designed to help shipping companies monitor, analyze, and manage their fleet's compliance with the rigorous EU FuelEU Maritime regulations. By leveraging a robust tech stack and a clean architecture, it ensures data accuracy, scalability, and a seamless user experience.

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![React](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node-20-green) ![Prisma](https://img.shields.io/badge/Prisma-5.0-blue)

## 🚀 Live Demo
- **Frontend:** [https://fuel-eu.vercel.app/](https://fuel-eu.vercel.app/) (Demo Link)
- **Backend API:** [https://fuel-eu-backend.onrender.com](https://fuel-eu-backend.onrender.com) (Demo Link)

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
- **🚢 Route Management:** Comprehensive tracking of maritime routes, including distance, fuel consumption, and calculated GHG intensity. Allows for granular analysis of each voyage.
- **📊 Compliance Monitoring:** Real-time calculation of Compliance Balance (CB) per ship and year. Instantly visualize whether a vessel is in surplus or deficit against EU targets.
- **🏦 Banking System:** A sophisticated banking mechanism that allows ships with a compliance surplus to "bank" their excess credits for future years, or "apply" previously banked credits to cover current deficits.
- **💧 Pooling:** Advanced simulation and creation of compliance pools. Group multiple vessels together to offset the deficits of some ships with the surpluses of others, optimizing the fleet's total compliance cost.
- **📈 Comparison Dashboard:** Interactive visualization tools to compare individual route performance against established baselines and regulatory targets, aiding in strategic decision-making.

### Technical Features
- **✅ Real-time Data:** The application is architected to support live updates via a RESTful API, ensuring decision-makers always have the latest data.
- **📱 Mobile Responsive:** Fully optimized for all devices. Whether on a desktop in the office or a tablet on the bridge, the interface adapts seamlessly using a responsive "Dark Slate" design.
- **🎨 Modern UI:** Built with `shadcn/ui` and Tailwind CSS, featuring a professional glassmorphism aesthetic with neon accents for high visibility and a modern feel.
- **🔒 Type-Safe:** Implemented entirely in TypeScript, ensuring type safety from the database layer (Prisma) to the frontend components (React), significantly reducing runtime errors.
- **🏗️ Hexagonal Architecture:** The backend follows the Ports and Adapters pattern, strictly separating business logic from infrastructure, making the system highly testable and maintainable.
- **🌐 RESTful API:** A well-structured and documented API allows for easy integration with other maritime systems and third-party tools.
- **🔄 CORS Enabled:** Configured for secure Cross-Origin Resource Sharing, allowing the frontend and backend to reside on different domains securely.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React (Next.js App Router) for server-side rendering and static generation.
- **Language:** TypeScript for robust, error-free code.
- **Styling:** Tailwind CSS for utility-first styling, combined with `shadcn/ui` for accessible, pre-built components.
- **Visualization:** `recharts` for rendering complex maritime data into understandable charts.
- **State Management:** Leverages React Server Components and Server Actions for efficient data fetching and mutation without heavy client-side libraries.
- **Deployment:** Vercel for instant global deployment and edge caching.

### Backend
- **Runtime:** Node.js 20+ for high-performance, non-blocking I/O operations.
- **Framework:** Express 5.1 for a flexible and robust API server.
- **Language:** TypeScript 5.9 for type safety across the full stack.
- **ORM:** Prisma 5.0 for intuitive database interaction, schema migrations, and type-safe queries.
- **Database:** PostgreSQL for reliable, relational data storage in production; SQLite for rapid local prototyping.
- **Architecture:** Hexagonal (Ports & Adapters) to decouple core logic from external dependencies.
- **Deployment:** Render for scalable containerized hosting.

## 🏗️ Architecture

This project adopts a **Hexagonal Architecture** (Ports and Adapters), a strategic choice to ensure the longevity and maintainability of the codebase.

### Backend Architecture
```
backend/
├── src/
│   ├── core/                    # Business Logic (Domain Layer)
│   │   ├── domain/              # Pure entities and business rules
│   │   │   ├── Entities.ts
│   │   │   └── Formulas.ts
│   │   ├── application/         # Use Cases orchestrating the domain
│   │   │   ├── BankingUseCase.ts
│   │   │   └── ComplianceUseCase.ts
│   │   └── ports/               # Interfaces defining external interactions
│   │       └── Repositories.ts
│   │
│   ├── adapters/                # Adapters Layer (Infrastructure)
│   │   ├── inbound/             # Driving Adapters (API Controllers)
│   │   │   └── http/
│   │   │       ├── BankingController.ts
│   │   │       └── ComplianceController.ts
│   │   │
│   │   └── outbound/            # Driven Adapters (DB Implementations)
│   │       └── postgres/
│   │           ├── BankingRepository.impl.ts
│   │           └── ComplianceRepository.impl.ts
│   │
│   └── infrastructure/          # Framework Configuration
│       └── server.ts
```

### Key Architectural Principles:
- **✅ Domain-Driven Design:** The core logic resides in the `domain` folder, completely isolated from frameworks and databases.
- **✅ Dependency Inversion:** High-level modules (Use Cases) do not depend on low-level modules (Database); both depend on abstractions (Ports).
- **✅ Testability:** Since the core logic depends only on interfaces, we can easily inject mock repositories for unit testing.
- **✅ Flexibility:** We can swap the underlying database (e.g., from SQLite to PostgreSQL) simply by implementing a new Adapter, without touching a single line of business logic.

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v20.x or higher.
- **npm:** v10.x or higher.
- **Database:** A running PostgreSQL instance (or use the default SQLite configuration for development).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ManishPalsaniya/FuelEU.git
    cd FuelEU
    ```

2.  **Install Backend Dependencies**
    Navigate to the backend directory and install the necessary packages.
    ```bash
    cd backend
    npm install
    # Generate Prisma Client based on the schema
    npx prisma generate
    ```

3.  **Install Frontend Dependencies**
    Navigate to the frontend directory (root or src depending on structure).
    ```bash
    cd ../src
    npm install
    ```

### Configuration

#### Backend Environment Variables
Create a `.env` file in the `backend/` directory to configure your environment.
```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/fueleu_db"
# For development with SQLite:
# DATABASE_URL="file:./dev.db"
```

### Running Locally

1.  **Start Backend Server**
    ```bash
    cd backend
    npm run dev
    ```
    The backend API will start on `http://localhost:3001`.

2.  **Start Frontend Application**
    Open a new terminal window.
    ```bash
    # From the root directory
    npm run dev
    ```
    The frontend application will be accessible at `http://localhost:3000`.

## 🌐 Deployment

### Backend Deployment (Render)
1.  Push your code to a GitHub repository.
2.  Create a new **Web Service** on Render.
3.  Connect your repository.
4.  Set the **Build Command** to `npm install && npm run build`.
5.  Set the **Start Command** to `npm start`.
6.  Add the `DATABASE_URL` environment variable pointing to your production PostgreSQL database.

### Frontend Deployment (Vercel)
1.  Import your GitHub repository into Vercel.
2.  Vercel will automatically detect the Next.js/Vite framework.
3.  Configure the **Build Command** (`npm run build`) if necessary.
4.  Deploy. Vercel will provide a live URL and handle SSL certificates automatically.

## 📚 API Documentation

### Base URL
- **Production:** `https://fuel-eu-backend.onrender.com/api`
- **Local:** `http://localhost:3001/api`

### Endpoints

#### Routes
- `GET /routes`: Retrieve a list of all maritime routes.
- `GET /routes/:id`: Retrieve details for a specific route.
- `POST /routes/:id/baseline`: Mark a specific route as the baseline for comparisons.

#### Compliance
- `GET /compliance/cb?year=YYYY`: Get the calculated compliance balance for a specific year.
- `GET /compliance/adjusted-cb?year=YYYY`: Get the compliance balance after banking/pooling adjustments.
- `POST /compliance/cb/:shipId/:year`: Trigger a recalculation of compliance for a ship.

#### Banking
- `POST /banking/bank`: Bank a surplus amount for future use.
- `POST /banking/apply`: Apply a previously banked surplus to a current deficit.
- `GET /banking/records`: Retrieve the full history of banking transactions.

#### Pooling
- `POST /pools`: Create a new compliance pool with selected ships.
- `GET /pools/:poolId/members`: Get details of ships within a specific pool.

## 📁 Project Structure

```
fuel-eu/
├── backend/                 # Backend API (Node.js + Express + Prisma)
│   ├── src/
│   │   ├── core/           # Pure Business Logic
│   │   ├── adapters/       # Interface Adapters (Controllers, Repositories)
│   │   └── infrastructure/ # Frameworks & Drivers (Server, DB Config)
│   ├── prisma/             # Database Schema & Migrations
│   └── package.json
│
├── src/                     # Frontend App (Next.js)
│   ├── app/                # App Router Pages & Layouts
│   ├── components/         # Reusable UI Components
│   ├── lib/                # Utilities, Types, & Server Actions
│   └── package.json
│
├── AGENT_WORKFLOW.md        # Detailed log of AI Agent collaboration
├── README.md                # Project documentation
└── REFLECTION.md            # Technical decisions and retrospective
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

**Manish Palsaniya**
- Email: [palsaniyamanish325@gmail.com](mailto:palsaniyamanish325@gmail.com)

## 🙏 Acknowledgments

- **EU FuelEU Maritime Regulation:** For the compliance guidelines.
- **Prisma Team:** For the excellent ORM.
- **Vercel & Render:** For providing robust hosting platforms.
- **React Community:** For the endless resources and support.

---
Built with ⚡ by **Manish Palsaniya**
