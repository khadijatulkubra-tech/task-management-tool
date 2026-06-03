# Task Management Tool

A full-stack web application for managing tasks built with ASP.NET Core and React.js.

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| ASP.NET Core (.NET 10) | Backend REST API |
| React.js | Frontend UI |
| Entity Framework Core | Database ORM |
| SQL Server Express | Database |
| JWT Bearer | Authentication |
| Serilog | Logging |
| xUnit | Unit Testing |
| SonarQube | Code Quality |
| Git | Version Control |

## ✅ Features

- User Registration & Login (JWT Authentication)
- Role-based Access Control (Admin & User)
- Task CRUD (Create, Read, Update, Delete)
- Task Priority, Status & Categories
- Due Dates Assignment
- Admin Dashboard (view & manage all users tasks)
- User Dashboard (personal task stats)
- Global Exception Handling Middleware
- Application Logging with Serilog
- Unit Tests (8 tests passing)
- SonarQube Integration (Quality Gate: Passed)

## 📱 Application Screens

- Login / Register
- User Dashboard (task counts by status)
- Task List (with filters)
- Task Detail
- New Task Form
- User Profile
- Admin Login
- Admin Dashboard (all users & tasks)

## 🛠️ Prerequisites

Make sure these are installed:

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js (v18+)](https://nodejs.org/)
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [SQL Server Management Studio (SSMS)](https://aka.ms/ssmsfullsetup)
- [Git](https://git-scm.com/)

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/khadijatulkubra-tech/task-management-tool.git
cd task-management-tool
```

### 2. Backend Setup

```bash
cd backend/TaskManagement.API/TaskManagement.API

# Restore packages
dotnet restore

# Install EF Core tools
dotnet tool install --global dotnet-ef

# Create database
dotnet ef database update

# Run backend
dotnet run
```

Backend will start at: `http://localhost:5241`
Swagger UI: `http://localhost:5241/swagger`

### 3. Frontend Setup

```bash
cd frontend

# Install packages
npm install

# Start frontend
npm start
```

Frontend will start at: `http://localhost:3000`

## 👤 Default Admin Account

After running the backend, create an admin account:

1. Register normally via Swagger: `POST /api/Auth/register`
2. Open SSMS and run:

```sql
USE TaskManagementDB;
UPDATE Users SET Role = 'Admin' WHERE Email = 'your-email@example.com';
```

Admin Login URL: `http://localhost:3000/admin`
Admin Account Email and Password
email: admin@gmail.com
pass : aliali12#@

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/Auth/register | Register new user |
| POST | /api/Auth/login | Login user |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/Tasks | Get all tasks |
| POST | /api/Tasks | Create task |
| GET | /api/Tasks/{id} | Get task by ID |
| PUT | /api/Tasks/{id} | Update task |
| DELETE | /api/Tasks/{id} | Delete task |

### Users (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/Users | Get all users |

## 🧪 Running Tests

```bash
cd backend/TaskManagement.API
dotnet test
```

**8 tests passing:**
- Register with new email ✅
- Register with existing email returns null ✅
- Login with valid credentials returns token ✅
- Login with wrong password returns null ✅
- Create task returns task ✅
- Get user tasks returns only user tasks ✅
- Get admin tasks returns all tasks ✅
- Delete task returns true ✅

## 📊 SonarQube Analysis

Quality Gate: **Passed** ✅

| Metric | Result |
|---|---|
| Security | A |
| Maintainability | A |
| Duplications | 0% |
| Lines of Code | 1,300+ |

### Run SonarQube Analysis

```bash
# Start SonarQube first
C:\sonarqube\bin\windows-x86-64\StartSonar.bat

# Then run analysis
dotnet sonarscanner begin /k:"TaskManagement" /d:sonar.host.url="http://localhost:9000" /d:sonar.token="YOUR_TOKEN"
dotnet build
dotnet sonarscanner end /d:sonar.token="YOUR_TOKEN"
```
