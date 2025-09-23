# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

推拿预约小程序 (Massage Appointment Mini-Program) - A WeChat mini-program built with Taro 3.x + React + TypeScript, following a Mock-Driven Development approach. The frontend operates independently via a comprehensive mock data layer that defines API contracts.

## Essential Commands

```bash
# Development
npm run dev:weapp    # Start development (uses localhost:3001 by default)
npm run dev:api      # Start with remote API (emagen.323424.xyz)

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

### Mock-First Development Strategy
- All features developed against mock layer first (`src/mock/data/` and `src/services/`)
- API endpoint configuration via `TARO_APP_API` environment variable
- Default API: localhost:3001, Remote API: emagen.323424.xyz
- Mock layer defines complete data contracts serving as frontend-backend specification

### Data Flow Architecture
```
Pages → Services → Config (api.ts) → Mock/Real API
         ↓
      TypeScript Types (src/types/index.ts)
```

### Service Layer Pattern
Services in `src/services/` implement business logic with dual support:
- Mock mode: Returns data from `src/mock/data/`
- API mode: Makes real HTTP requests to backend

Example: `therapist.service.ts` demonstrates the pattern with location-based recommendations and pagination.

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
2. Create mock data in `src/mock/data/`
3. Implement service layer with mock/API switching
4. Build UI components and pages
5. Write tests for service logic

### API Integration
When transitioning from mock to real API:
1. Ensure backend matches TypeScript interfaces exactly
2. Update `src/config/api.ts` with endpoint configuration
3. Test with `npm run dev:api`
4. Verify mock/API responses are identical

## Testing Approach

- **Framework**: Jest with ts-jest
- **Mock Taro APIs**: Already configured in `src/__mocks__/@tarojs/taro.js`
- **Service Testing**: Focus on business logic (see `therapist.service.test.ts`)
- **Location Testing**: Distance calculations critical for nearby features

## Project Structure

```
massage-app/
├── src/
│   ├── pages/           # Taro pages (TabBar: appointment, gifts, profile)
│   ├── components/      # Reusable UI components
│   ├── services/        # Business logic with mock/API switching
│   ├── mock/data/       # Mock data definitions
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

### Mock Data Completeness
- Every field in TypeScript interfaces must have mock data
- Mock services simulate realistic delays (200-500ms)
- Pagination implemented in mock layer matching API specs

### Environment Configuration
- API endpoint controlled by `TARO_APP_API` environment variable
- Default API base URL: `http://localhost:3001/api/v2`
- Remote API: `http://emagen.323424.xyz/api/v2`
- Configuration in `src/config/api.ts`

## Key Files to Understand

1. **`src/types/index.ts`** - Complete data model definitions
2. **`src/services/therapist.service.ts`** - Service layer pattern example
3. **`src/config/api.ts`** - API configuration and switching logic
4. **`src/mock/data/`** - Mock data structure and relationships
5. **`src/pages/appointment/`** - Core booking flow implementation

## 🚀 Complete Development and Debugging Guide

### 一、WeChat Mini-Program Development (Recommended)

#### 1️⃣ Start Development Server
```bash
# Connect to remote API (recommended)
npm run dev:api

# Or use local backend (localhost:3001)
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
**Solution**: Use `npm run dev:api` to connect to remote backend

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
# Mini-program (remote API)
npm run dev:api

# H5 development (remote API)
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
| Mini-program Dev | `npm run dev:api` | - | Connect remote API |
| H5 Dev | `npm run dev:h5:api` | 8081 | Hot reload dev |
| H5 Build | `npm run build:h5` | - | Production build |
| H5 Preview | `python3 -m http.server 8082` | 8082 | Static server |

### Core Principles
- 🎯 Development: Use `dev:api` (auto-connects to remote)
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