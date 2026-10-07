# ApexCare Hospital Management System (HMS)

An enterprise-grade, HIPAA/NABH-conscious Hospital Management System (HMS) built with **Next.js 14**, **NestJS**, and **MongoDB**.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Lucide Icons
- **Backend**: NestJS (Modular Architecture, TypeScript) + Mongoose ODM
- **Database**: MongoDB 7.0+ (NoSQL document store with ACID multi-document transactions)
- **Cache**: Redis 7.2 (Appointment slot locks, token queues)
- **Security & RBAC**: JWT Bearer Tokens with role-based guards (`Admin`, `Doctor`, `Nurse`, `Pharmacist`, `LabTech`, `Receptionist`, `Patient`)
- **Documentation**: Swagger OpenAPI (`/api/docs`)

---

## 📁 Repository Structure

```
Hospital-Management-System/
├── docker-compose.yml           # Full-stack orchestrator (MongoDB, Redis, Backend, Frontend)
├── backend/                     # NestJS API Server
│   ├── src/
│   │   ├── common/              # RBAC guards, decorators, enum definitions
│   │   ├── modules/
│   │   │   ├── auth/            # JWT authentication & passport strategy
│   │   │   ├── users/           # Staff & doctor directory
│   │   │   ├── patients/        # Master EHR & automatic MRN counter
│   │   │   ├── appointments/    # Doctor slots & OPD live token queue
│   │   │   ├── wards/           # Inpatient (IPD) bed allocation & vitals
│   │   │   ├── pharmacy/        # Drug inventory, FIFO batches & dispensation
│   │   │   ├── laboratory/      # Lab test catalog, orders & reports
│   │   │   ├── billing/         # Consolidated invoicing & payment receipts
│   │   │   └── seed/            # Automatic database bootstrap seeder
│   │   ├── app.module.ts
│   │   └── main.ts              # Swagger & API entrypoint
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/                    # Next.js 14 Client Portal
│   ├── src/
│   │   ├── app/                 # App Router pages and styling
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Interactive Role Switcher & Hospital header
│   │   │   ├── Sidebar.tsx      # RBAC-aware navigation
│   │   │   └── modules/         # Dedicated clinical module views
│   │   └── types/               # TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.ts
│   └── Dockerfile
└── README.md
```

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

To launch MongoDB, Redis, the NestJS Backend, and Next.js Frontend with a single command:

```bash
docker compose up -d --build
```

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Swagger Documentation**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

---

### Option 2: Running Locally (Node.js & MongoDB)

#### 1. Backend Setup:
```bash
cd backend
npm install
npm run start:dev
```
*Make sure MongoDB is running locally on port 27017 or configure `MONGO_URI` in `backend/.env` (supports MongoDB Atlas).*

#### 2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Default Seeded Hospital Credentials

The backend automatically seeds initial staff accounts on first launch:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@hospital.com` | `Hospital@123` | Chief Administrator |
| **Doctor** | `doctor.sarah@hospital.com` | `Hospital@123` | Interventional Cardiology |
| **Doctor** | `doctor.james@hospital.com` | `Hospital@123` | Clinical Neurology |
| **Nurse** | `nurse.emily@hospital.com` | `Hospital@123` | Inpatient Care |
| **Pharmacist** | `pharma.alex@hospital.com` | `Hospital@123` | Central Pharmacy |
| **Lab Tech** | `lab.david@hospital.com` | `Hospital@123` | Diagnostics & Pathology |
| **Receptionist** | `reception.lisa@hospital.com` | `Hospital@123` | Front Desk & Invoicing |

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Module | Super Admin | Doctor | Nurse | Pharmacist | Lab Tech | Reception / Billing |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Patient Registration** | Full | View | View | View | View | Full |
| **Appointments & OPD** | Full | Full | View | View | View | Full |
| **Ward Beds (IPD)** | Full | View | Full | None | None | View |
| **Pharmacy & Dispense** | Full | View | View | Full | None | None |
| **Laboratory Diagnostics** | Full | Order | View | None | Full | None |
| **Billing & Payments** | Full | None | None | None | None | Full |
