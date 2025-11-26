# Fuel EU Compliance Maritime Dashboard

## Overview
The **Fuel EU Compliance Maritime Dashboard** is a comprehensive tool designed to help maritime companies manage and analyze their fleet's compliance with FuelEU Maritime regulations. It provides features for:
- **Route Analysis:** Tracking GHG intensity and fuel consumption per route.
- **Compliance Comparison:** Visualizing route performance against baseline and targets.
- **Banking & Borrowing:** Managing compliance surpluses and deficits via banking mechanisms.
- **Pooling:** Simulating and creating compliance pools to optimize fleet performance.

## Architecture Summary
The application follows a modern, decoupled architecture:

### Frontend
- **Framework:** Next.js (React) with TypeScript.
- **UI Library:** `shadcn/ui` components styled with Tailwind CSS.
- **Data Visualization:** `recharts` for interactive charts.
- **State Management:** React Server Components and Server Actions for data fetching and mutations.

### Backend
The backend implements a **Hexagonal Architecture (Ports and Adapters)** to separate business logic from external concerns:
- **Core (Domain & Application):** Contains business rules (e.g., `BankingUseCase`, `ComplianceUseCase`) and entities.
- **Ports:** Interfaces defining how the core interacts with the outside world (e.g., `BankingRepository`, `ComplianceRepository`).
- **Adapters:**
    - **Inbound:** HTTP Controllers (Express.js) handling API requests.
    - **Outbound:** Repository implementations (PostgreSQL/Prisma) for data persistence.

## Setup & Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1.  **Clone the repository.**
2.  **Install dependencies** for both frontend and backend:
    ```bash
    # Root (Frontend)
    npm install

    # Backend
    cd backend
    npm install
    ```

### Running the Application
You need to run both the frontend and backend servers concurrently.

1.  **Start the Backend:**
    ```bash
    cd backend
    npm run dev
    ```
    The backend API will typically run on port `3001` (or as configured).

2.  **Start the Frontend:**
    ```bash
    # In a new terminal, from the root directory
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

## Key Features & Usage

### 🚢 Routes
Manage individual route data. Set a route as a **Baseline** to enable comparisons.

### 📊 Compare
Compare other routes against your set baseline.
- **Visuals:** Bar charts showing GHG intensity vs. Target.
- **Metrics:** Compliance status, % difference from baseline.

### 🏦 Banking
Manage your compliance balance.
- **Bank Surplus:** If a ship has a positive balance, bank it for future use.
- **Apply Surplus:** Use banked amounts to cover deficits.
- **History:** View a log of all banking transactions.

### 💧 Pooling
Create compliance pools to offset deficits with surpluses from other ships.
- **Simulator:** Real-time validation of pool validity (e.g., min 2 members, positive net balance).

## Testing
To execute tests (if configured):
```bash
npm test
```
