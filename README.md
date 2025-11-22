VennSpace

VennSpace is an interactive web application designed for creating Venn diagrams, visualizing set theory, and calculating probability partitions. It features a robust mathematical engine capable of handling complex set operations and dynamic rendering.

🚀 Tech Stack

Frontend

Framework: React.js (v18+)

Routing: React Router DOM

Styling: Custom CSS Variables with "Slate & Indigo" Theme

Features: Dark Mode support, Responsive Grid Layout

Backend

Framework: Java Spring Boot

Logic: Bitmasking for N-Set Partitioning

API: RESTful Endpoints for Set/Element CRUD operations

Data Structure: In-memory graph (moving to PostgreSQL in Phase 3)

✨ Features

Project Management: Create blank diagrams or start from templates (Deck of Cards, Dice Rolls).

Dynamic Sets & Elements: Create sets and elements, then assign memberships via a matrix.

Live Partitioning: Automatically calculates fundamental regions (e.g., $A \cap B \cap C'$) and displays their contents.

Set Operations Calculator: Perform Unions, Intersections, Differences, and Complements.

Dark Mode: A toggleable "Slate & Indigo" dark theme that persists across sessions.

🛠️ Getting Started

Prerequisites

Node.js (v14 or higher)

Java Development Kit (JDK) 17 or higher

Maven (optional, if using Maven Wrapper)

1. Start the Backend (Java)

Navigate to the backend directory:

cd backend
./mvnw spring-boot:run


The server will start on http://localhost:8080

2. Start the Frontend (React)

Navigate to the frontend directory:

cd frontend
npm install
npm start


The application will open at http://localhost:3000

🗺️ Roadmap

Phase 1: Core Functionality (Completed) ✅

Java Back-End Engine (Set logic, Bitmasking)

Basic CRUD API

React Architecture & Routing

Phase 2: UI Polish & Analysis (In Progress) 🚧

[x] "Slate & Indigo" Design System

[x] Dark Mode Implementation

[ ] Probability Mode (Count/Percentage Toggle)

[ ] Visual UpSet Plots

Phase 3: Persistence & Security

[ ] PostgreSQL Integration

[ ] User Accounts & Authentication

📄 License

This project is for educational purposes.