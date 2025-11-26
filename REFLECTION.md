# 🔍 Technical Reflection: Fuel EU Compliance Dashboard

## Project Overview
This document serves as a comprehensive technical retrospective, capturing the architectural decisions, engineering challenges, innovative solutions, and key learnings derived from building the **Fuel EU Compliance Dashboard**. This project was conceived as a high-performance, full-stack maritime emissions tracking system designed to meet the complex regulatory requirements of the EU FuelEU Maritime initiative.

- **Project Duration:** 72 hours (Hackathon context)
- **Final Stack:** React (Next.js) + TypeScript + Prisma + PostgreSQL + Express + Render + Vercel
- **Architecture:** Hexagonal (Ports & Adapters)

## 🎯 Initial Requirements & Scope

### Business Requirements
The core objective was to build a system capable of:
1.  **Route Analysis:** Tracking maritime routes and calculating their GHG intensity based on fuel consumption and distance.
2.  **Compliance Calculation:** Determining the Compliance Balance (CB) per ship/year using EU formulas.
3.  **Banking Mechanism:** Implementing a robust ledger to "bank" surplus compliance units and "apply" them to deficit years.
4.  **Pooling Simulation:** Enabling fleet managers to group vessels to offset deficits with surpluses across the fleet.
5.  **Visual Comparison:** Providing intuitive dashboards to compare performance against baselines.

### Technical Requirements
To support these business goals, the system required:
-   A type-safe, full-stack TypeScript environment.
-   A scalable RESTful API following clean architecture principles.
-   A modern, responsive UI capable of complex data visualization.
-   Production-grade deployment on cloud infrastructure.
-   Persistent, relational data storage.

## 🏗️ Architecture Decisions

### 1. Hexagonal Architecture (Ports & Adapters)
**Decision:** We adopted the Hexagonal Architecture for the backend services.

**Rationale:**
Traditional layered architectures often lead to tight coupling between business logic and infrastructure (e.g., controllers directly calling database models). Hexagonal architecture inverts these dependencies.
-   **Testability:** By isolating the core domain, we could write unit tests for business logic without spinning up a database.
-   **Flexibility:** The core logic interacts with "Ports" (interfaces). The "Adapters" (implementations like Prisma or Express) can be swapped out with minimal impact.
-   **Maintainability:** It enforces a strict separation of concerns, preventing "spaghetti code" as the application grows.

**Implementation:**
The application is structured into concentric layers:
-   **Core (Center):** Contains `Entities` (Ship, Route) and `UseCases` (Banking, Compliance). It has zero dependencies on frameworks.
-   **Ports (Boundary):** Interfaces like `BankingRepository` define how the Core expects to interact with the world.
-   **Adapters (Outer):** `PrismaBankingRepository` implements the interface to talk to Postgres; `BankingController` translates HTTP requests into Use Case calls.

### 2. Database Strategy: PostgreSQL + Prisma
**Decision:** We selected PostgreSQL as the database engine, managed via Prisma ORM.

**Rationale:**
While NoSQL options like MongoDB offer flexibility, the maritime compliance domain is inherently relational. Ships have many Routes; Routes belong to Ships; Banking Records link to Ships.
-   **Relational Integrity:** PostgreSQL ensures data consistency (foreign keys, transactions) which is critical for financial/compliance data.
-   **Type Safety:** Prisma generates a TypeScript client based on the DB schema. This means if we change a column name in the DB, our code fails to compile immediately, preventing runtime errors.
-   **Migrations:** Prisma's migration tool provided a reliable way to evolve the database schema throughout the hackathon.

### 3. Frontend Architecture: Next.js & Server Actions
**Decision:** We utilized Next.js with the App Router and Server Actions.

**Rationale:**
-   **Performance:** Server Components allow us to fetch data directly from the DB on the server, reducing the JavaScript bundle sent to the client.
-   **Simplicity:** Server Actions eliminate the need for a separate API layer for simple mutations, streamlining the development of forms like the "Banking" interface.
-   **UX:** We combined server-side rendering with client-side interactivity (using `recharts` for visualization) to offer the best of both worlds.

## 🐛 Challenges & Solutions

### Challenge 1: Data Consistency (Year Mismatch)
**Problem:** During testing, the "Banking" feature failed with a generic "Compliance record not found" error.
**Root Cause:** The frontend interface was hardcoded to default to the year `2025` for future planning, but the backend seed data only contained records for the reporting year `2024`.
**Solution:**
We implemented a full-stack fix:
1.  Updated the backend `BankingUseCase` to throw specific, descriptive errors.
2.  Refactored the frontend `actions.ts` to accept a dynamic `year` parameter.
3.  Updated the `BankingDashboard` UI to pass the user-selected year to the server action.
4.  Set the default UI state to `2024` to align with available data.
**Lesson:** Never assume data availability. Always synchronize frontend defaults with backend seed data.

### Challenge 2: UI Theme Consistency
**Problem:** As features were added by different workflows, the UI became fragmented. The "Banking" tab had a specific "Dark Slate" theme, while "Routes" and "Pooling" used default styles.
**Solution:**
We performed a systematic "UI Unification" pass. We extracted the specific hex codes (`#393E46`, `#222831`) and border styles from the Banking tab and created a reusable design pattern. We then refactored the `Card`, `Table`, and `Select` components across the entire application to adhere to this theme, ensuring a cohesive user experience.

### Challenge 3: Mobile Responsiveness
**Problem:** Complex data tables and charts were breaking the layout on mobile devices.
**Solution:**
We adopted a mobile-first approach for the refactor.
-   Implemented a hamburger menu for navigation on small screens.
-   Added horizontal scrolling containers for data-heavy tables.
-   Adjusted chart dimensions dynamically based on screen width.
-   Ensured touch targets met the 44px minimum standard for usability.

## 📊 Performance Optimizations

1.  **Database Indexing:** We utilized Prisma to define indexes on frequently queried fields like `shipId` and `year`, ensuring O(1) lookup times for compliance checks.
2.  **Code Splitting:** Next.js automatically splits code by route, ensuring that users only download the JavaScript necessary for the page they are viewing.
3.  **Optimistic UI:** For banking operations, we implemented optimistic updates to provide instant feedback to the user while the server processed the transaction.

## 🎓 Key Learnings

### 1. Hexagonal Architecture Pays Off
Initially, setting up the layers (Ports, Adapters, Core) felt like boilerplate. However, when we needed to debug the banking logic, it was invaluable. We could look at the `BankingUseCase` and see the pure business logic without being distracted by HTTP status codes or SQL queries.

### 2. TypeScript is Non-Negotiable
The strict type system saved us countless hours. In one instance, we tried to pass a string "1000" to a function expecting a number. In JavaScript, this might have resulted in `NaN` at runtime. TypeScript caught it instantly in the editor.

### 3. Cloud-First Development
Using managed services like Render (Backend) and Vercel (Frontend) from the start allowed us to focus on code rather than infrastructure. We didn't spend time configuring Nginx or managing SSL certificates; the platforms handled it all.

## 💭 Final Thoughts
The **Fuel EU Compliance Dashboard** demonstrates that with the right architectural choices—**Clean Architecture**, **TypeScript**, and **Relational Data**—it is possible to build a robust, scalable, and maintainable full-stack application in a very short timeframe. The flexibility to adapt the UI and fix deep logic bugs quickly without rewriting the core system was the ultimate validation of our architectural strategy.

---
**Built with ⚡ by Manish Palsaniya**
