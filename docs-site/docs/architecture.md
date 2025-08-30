---
id: architecture
title: System Architecture
sidebar_label: Architecture
---

# 🏗️ System Architecture

HRFlow follows a modular and scalable full-stack architecture, separating concerns across three main layers: **Frontend**, **Backend API**, and **Database**.

---
## System Design

| Layer            | Frontend               | Backend API             | Database              |
|------------------|------------------------|--------------------------|------------------------|
| Technology       | Next.js                | Node.js + Express        | Supabase (PostgreSQL) |
| Communication    | ⇄                      | ⇄                        | ⇄                      |
| Responsibilities | UI Rendering           | Business Logic (Controllers) | Data Storage         |
| Authentication   | —                      | JWT                      | —                      |


## 🔄 High-Level System Design

The system is structured as follows:

- **Frontend**: Built with Next.js, responsible for rendering UI and handling client-side interactions.
- **Backend API**: Developed with Node.js and Express, exposing RESTful endpoints and managing business logic.
- **Database**: Managed via Supabase (PostgreSQL), storing all persistent data securely.

Each layer communicates through well-defined interfaces, ensuring maintainability and scalability.

---

## 🖥️ Frontend Architecture

- **Framework**: Next.js 14 with App Router for modern React development
- **Component Architecture**:  
  - *Server Components*: Optimized for performance  
  - *Client Components*: Enable interactivity and dynamic behavior
- **State Management**: React built-in hooks and component-level state
- **Styling**: TailwindCSS for utility-first responsive design
- **Data Fetching**: Native `fetch` API with robust error handling

---

## ⚙️ Backend Architecture

- **Runtime**: Node.js with Express.js for RESTful API implementation
- **Authentication**: JWT-based stateless authentication
- **Database Integration**: PostgreSQL via Supabase with relational modeling
- **Middleware**: Custom layers for authentication and authorization
- **Services**: Decoupled business logic organized in service modules

---

## 🔁 Data Flow Overview

- 🔐 **Authentication**:  
  Users authenticate via JWT tokens, enabling secure session management.

- 🧑‍💼 **Role-Based Access**:  
  API routes are protected and differentiated based on user roles (HR vs Employee).

- 🗄️ **Database Operations**:  
  All data interactions are abstracted through models and services.

- 📊 **Metrics Calculation**:  
  Real-time KPIs are computed via dedicated backend services.

- ⚡ **UI Updates**:  
  Frontend reacts responsively to state changes and API responses.

---

> This architecture ensures a clean separation of concerns, promotes scalability, and aligns with best practices for modern web application development.
