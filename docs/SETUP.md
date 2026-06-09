# Setup Guide

Complete setup guide untuk Retinopathy Disease Detection project.

## 📋 Prerequisites

### System Requirements
- **OS**: macOS, Linux, atau Windows (dengan WSL2)
- **Node.js**: 18.0.0 atau lebih tinggi
- **Python**: 3.8 atau lebih tinggi
- **Git**: Latest version
- **RAM**: Minimal 4GB (8GB recommended)
- **Disk**: Minimal 5GB free space

### Check Versions
```bash
node --version      # Should be v18+
npm --version       # Should be 8+
python --version    # Should be 3.8+
git --version       # Latest
```

## 🚀 Quick Start (5 minutes)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/retinopaty-disease-detection.git
cd retinopaty-disease-detection
```

### 2. Install Dependencies
```bash
# Frontend
npm install
npx playwright install

# Backend
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Setup Environment
```bash
# Copy example files
cp .env.example .env.local
cp backend/.env.example backend/.env
```

### 4. Start Development
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
python -m uvicorn app.main:app --reload
```

### 5. Open in Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📦 Detailed Installation

### Frontend Setup

#### 1. Install Node.js
**macOS (using Homebrew)**
```bash
brew install node
```

**Windows**
- Download from https://nodejs.org/
- Run installer

**Linux (Ubuntu/Debian)**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Install Playwright Browsers
```bash
npx playwright install
```

#### 4. Create Environment File
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### 5. Verify Installation
```bash
npm run build
```

### Backend Setup

#### 1. Install Python
**macOS (using Homebrew)**
```bash
brew install python@3.11
```

**Windows**
- Download from https://www.python.org/
- Run installer (check "Add Python to PATH")

**Linux (Ubuntu/Debian)**
```bash
sudo apt-get install python3.11 python3.11-venv
```

#### 2. Create Virtual Environment
```bash
cd backend
python3 -m venv venv
```

#### 3. Activate Virtual Environment
**macOS/Linux**
```bash
source venv/bin/activate
```

**Windows (PowerShell)**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt)**
```cmd
venv\Scripts\activate.bat
```

#### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 5. Create Environment File
```bash
cp .env.example .env
```

Edit `backend/.env`:
```env
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False
MODEL_PATH=models/model.h5
```

#### 6. Verify Installation
```bash
python -m uvicorn app.main:app --help
```

## 🐳 Docker Setup

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Installation

#### 1. Build Images
```bash
docker-compose build
```

#### 2. Start Services
```bash
docker-compose up -d
```

#### 3. Check Services
```bash
docker-compose ps
```

#### 4. View Logs
```bash
docker-compose logs -f
```

#### 5. Stop Services
```bash
docker-compose down
```

### Docker Commands
```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Shell access
docker-compose exec frontend sh
docker-compose exec backend bash

# Remove volumes
docker-compose down -v
```

## 🧪 Testing Setup

### Install Playwright
```bash
npx playwright install
```

### Run Tests
```bash
# All tests
npm run test:e2e

# Interactive UI
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

## 🔧 Development Tools

### Recommended VSCode Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Python
- Pylance
- FastAPI
- Thunder Client (API testing)

### Recommended Tools
- Postman (API testing)
- DBeaver (Database management)
- Git Kraken (Git GUI)
- TablePlus (Database GUI)

## 📝 Configuration Files

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# App Configuration
NEXT_PUBLIC_APP_NAME=Retinopathy Disease Detection
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional: Analytics
# NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Backend (backend/.env)
```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False

# Model Configuration
MODEL_PATH=models/model.h5
MODEL_CONFIDENCE_THRESHOLD=0.8

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000"]
```

## 🚀 Running Locally

### Terminal Setup (Recommended)
Use tmux or split terminals:

**Terminal 1: Frontend**
```bash
npm run dev
```

**Terminal 2: Backend**
```bash
cd backend
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
python -m uvicorn app.main:app --reload
```

**Terminal 3: Tests (Optional)**
```bash
npm run test:e2e:ui
```

### Accessing Services
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **API ReDoc**: http://localhost:8000/redoc

## 🐛 Troubleshooting

### Node.js Issues

**Problem**: `npm: command not found`
```bash
# Solution: Install Node.js
brew install node  # macOS
# or download from https://nodejs.org/
```

**Problem**: `npm ERR! code ERESOLVE`
```bash
# Solution: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Python Issues

**Problem**: `python: command not found`
```bash
# Solution: Install Python
brew install python@3.11  # macOS
# or download from https://www.python.org/
```

**Problem**: `ModuleNotFoundError`
```bash
# Solution: Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
.\venv\Scripts\activate.ps1  # Windows PowerShell
```

### Port Already in Use

**Problem**: `Address already in use :3000`
```bash
# Solution: Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
# or
netstat -ano | findstr :3000   # Windows (find PID)
taskkill /PID <PID> /F         # Windows (kill process)
```

### Docker Issues

**Problem**: `docker: command not found`
```bash
# Solution: Install Docker Desktop
# Download from https://www.docker.com/products/docker-desktop
```

**Problem**: `Cannot connect to Docker daemon`
```bash
# Solution: Start Docker Desktop
# Open Docker Desktop application
```

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Python installed (`python --version`)
- [ ] Git installed (`git --version`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Playwright installed (`npx playwright install`)
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env.local` created and configured
- [ ] `backend/.env` created and configured
- [ ] Frontend starts (`npm run dev`)
- [ ] Backend starts (`python -m uvicorn app.main:app --reload`)
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend API accessible at http://localhost:8000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Tests run successfully (`npm run test:e2e`)

## 🎯 Next Steps

1. **Read Documentation**
   - [README.md](../README.md) - Project overview
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
   - [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide
   - [E2E_TESTING.md](E2E_TESTING.md) - Testing guide

2. **Start Development**
   - Create feature branch: `git checkout -b feature/your-feature`
   - Make changes
   - Run tests: `npm run test:e2e`
   - Commit changes: `git commit -m "feat: your feature"`

3. **Deploy**
   - See [README.md](../README.md#-deployment) for deployment instructions

## 📞 Getting Help

- Check [Troubleshooting](#-troubleshooting) section
- Read [CONTRIBUTING.md](CONTRIBUTING.md)
- Check existing GitHub issues
- Create new GitHub issue with details

## 🔗 Useful Links

- [Node.js Documentation](https://nodejs.org/docs/)
- [Python Documentation](https://docs.python.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Docker Documentation](https://docs.docker.com/)
- [Playwright Documentation](https://playwright.dev)

---

**Setup Guide Version**: 1.0.0  
**Last Updated**: June 9, 2026
