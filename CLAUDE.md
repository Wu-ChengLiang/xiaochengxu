# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

推拿预约小程序 (Massage Appointment Mini-Program) - A WeChat mini-program built with Taro 3.x + React + TypeScript. A production-ready application connecting to real backend APIs for massage appointment booking and management.

## Essential Commands

```bash
# Development
npm run dev:api      # Start development with production API (emagen.323424.xyz)
npm run dev:weapp    # Start with local API (localhost:3001) - for backend development

# Build
npm run build:weapp  # Production build for WeChat

# Testing
npm test             # Run all tests
npm test -- --watch  # Watch mode
npm test -- therapist.service.test  # Run specific test

# Code Quality
npm run lint         # Check code style
npm run lint:fix     # Auto-fix issues
```

## Architecture Decisions

### Production API Integration
- Direct integration with production backend API (emagen.323424.xyz)
- API endpoint configuration via `TARO_APP_API` environment variable
- Production API: emagen.323424.xyz, Local API: localhost:3001 (for backend development)
- TypeScript interfaces ensure type safety across frontend-backend communication

### Data Flow Architecture
```
Pages → Services → Config (api.ts) → Production API
         ↓
      TypeScript Types (src/types/index.ts)
```

### Service Layer Pattern
Services in `src/services/` implement business logic with HTTP requests to backend:
- Production mode: Makes HTTP requests to production API
- Local development: Can connect to local backend for testing

Example: `therapist.service.ts` implements location-based recommendations and pagination with real API calls.

### State Management
- Global state: Zustand stores
- Page state: React hooks
- Persistent state: Taro storage API

## Core Data Models

All models fully typed in `src/types/index.ts`:
- **User**: Member profile with points and level
- **Store**: Location-enabled with business hours and status
- **Therapist**: Ratings, expertise, availability tracking
- **Appointment**: Complete booking lifecycle management
- **Service**: Treatment catalog with pricing

## Development Workflow

### Adding New Features
1. Define TypeScript interface in `src/types/index.ts`
2. Implement service layer with API calls
3. Build UI components and pages
4. Write tests for service logic
5. Test with production API

### API Integration
Working with production API:
1. Ensure backend implements TypeScript interfaces correctly
2. Configure endpoints in `src/config/api.ts`
3. Test with `npm run dev:api`
4. Handle error cases and loading states

## Testing Approach

- **Framework**: Jest with ts-jest
- **Service Testing**: Focus on business logic (see `therapist.service.test.ts`)
- **API Testing**: Test service layer with real API endpoints
- **Location Testing**: Distance calculations critical for nearby features

## Project Structure

```
massage-app/
├── src/
│   ├── pages/           # Taro pages (TabBar: appointment, gifts, profile)
│   ├── components/      # Reusable UI components
│   ├── services/        # Business logic with API integration
│   ├── types/           # TypeScript type definitions
│   ├── config/          # API and app configuration
│   └── utils/           # Helpers (location, formatting)
├── config/              # Taro build configuration
└── project.config.json  # WeChat mini-program settings
```

## Critical Implementation Details

### Location-Based Features
- Distance calculation uses Haversine formula (`utils/location.ts`)
- Therapist recommendations sorted by distance + rating
- Store listing prioritizes proximity

### Environment Configuration
- API endpoint controlled by `TARO_APP_API` environment variable
- Production API: `http://emagen.323424.xyz/api/v2` (default)
- Local API: `http://localhost:3001/api/v2` (for backend development)
- Configuration in `src/config/api.ts`

## Key Files to Understand

1. **`src/types/index.ts`** - Complete data model definitions
2. **`src/services/therapist.service.ts`** - Service layer pattern example
3. **`src/config/api.ts`** - API configuration and endpoint management
4. **`src/pages/appointment/`** - Core booking flow implementation
5. **`src/utils/location.ts`** - Location-based calculations and utilities

## 🚀 Complete Development and Debugging Guide

### 一、WeChat Mini-Program Development (Recommended)

#### 1️⃣ Start Development Server
```bash
# Connect to production API (recommended)
npm run dev:api

# Or use local backend for backend development
npm run dev:weapp
```

#### 2️⃣ Open WeChat DevTools
- Import project: Select `dist` directory
- Compile mode: Choose "Normal Compile"
- Preview: Click "Preview" or "Remote Debug"

#### 3️⃣ Debugging
- Console Panel: View log output
- Network Panel: Monitor API requests
- AppData Panel: Inspect data state

### 二、H5 Browser Development

#### 1️⃣ Start Development Server (Hot Reload)
```bash
# Development mode (port 8081)
npm run dev:h5:api
# Access: http://localhost:8081
```

#### 2️⃣ Production Build Server (Optional)
```bash
# Build first
TARO_APP_API=http://emagen.323424.xyz/api/v2 npm run build:h5

# Python static server (port 8082)
cd dist && python3 -m http.server 8082
# Access: http://localhost:8082
```

#### 3️⃣ Browser Debugging
- Press F12 for DevTools
- Network: View API requests
- Console: Check errors
- Hard refresh: Ctrl+Shift+R (clear cache)

### 三、Common Issues & Solutions

#### 🔴 API Connection Error
```
ERR_CONNECTION_REFUSED localhost:3001
```
**Solution**: Use `npm run dev:api` to connect to production backend

#### 🔴 WebSocket Error
```
WebSocket connection failed
```
**Solution**: Port conflict, clean processes and restart

#### 🔴 Port Already in Use
```bash
# Check port usage
lsof -i :8081  # For H5 dev server
lsof -i :8082  # For Python static server

# Kill process
kill -9 [PID]
```

### 四、Complete Debugging Checklist

#### ✅ Pre-launch Check
1. Confirm no port conflicts
2. Choose correct start command
3. Verify API configuration

#### ✅ Start Services
```bash
# Mini-program (production API)
npm run dev:api

# H5 development (production API)
npm run dev:h5:api

# H5 production build
export TARO_APP_API=http://emagen.323424.xyz/api/v2
npm run build:h5
cd dist && python3 -m http.server 8082
```

#### ✅ Verify Running
- Mini-program: Check in WeChat DevTools
- H5 Dev: http://localhost:8081 (Taro dev server with hot reload)
- H5 Prod: http://localhost:8082 (Python static server)

#### ✅ Debugging Tips
1. Check network requests: Confirm API address
2. Review Console: See error details
3. Clear cache: Solve resource loading issues
4. Check logs: Use BashOutput for service output

### 五、Recommended Workflow

```
Start
  ↓
Choose Platform (Mini-program/H5)
  ↓
Start Development Server
  ↓
Open Debug Tools
  ↓
Modify Code → Auto Hot Reload
  ↓
Debug API/UI
  ↓
Build Production Version
  ↓
Test Production Version
```

### 六、Quick Command Reference

| Purpose | Command | Port | Description |
|---------|---------|------|-------------|
| Mini-program Dev | `npm run dev:api` | - | Connect production API |
| H5 Dev | `npm run dev:h5:api` | 8081 | Hot reload dev |
| H5 Build | `npm run build:h5` | - | Production build |
| H5 Preview | `python3 -m http.server 8082` | 8082 | Static server |

### Core Principles
- 🎯 Development: Use `dev:api` (connects to production API)
- 🎯 Debug: Check Network and Console panels
- 🎯 Issues: Clear cache and restart first

### 七、Service Status Summary

When both H5 services are running:
- **Port 8081**: Taro H5 development server (hot reload, development mode)
- **Port 8082**: Python static file server (serves production build from dist/)

This setup allows you to:
1. Develop with hot reload on port 8081
2. Test production build on port 8082
3. Compare development vs production behavior side by side