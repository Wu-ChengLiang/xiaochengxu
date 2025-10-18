# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

推拿预约小程序 (Massage Appointment Mini-Program) - A WeChat mini-program built with Taro 3.x + React + TypeScript. A production-ready application connecting to real backend APIs for massage appointment booking and management.

**Monorepo Structure**:
- `massage-app/` - Taro 3.x frontend (WeChat mini-program + H5)
- `backend/` - Node.js backend with SQLite database
- `api-docs/` - API specifications (always read before implementing features)
- `docs/` - Product requirements (PRD) and technical architecture documents

## Quick Start

**Before any implementation**:
1. Read relevant API docs in `api-docs/` (e.g., `01-门店API.md` for store features)
2. Check `massage-app/src/types/index.ts` for existing type definitions
3. Review `docs/产品需求文档PRD.md` for product context

**Common workflows**:
```bash
# Start development (most common)
cd massage-app && npm run dev:api

# Run tests
cd massage-app && npm test

# Debug H5 in browser
cd massage-app && npm run dev:h5:api
# Then open http://localhost:8081
```

## Essential Commands

**IMPORTANT**: All commands must be run from `massage-app/` directory:
```bash
cd /home/chengliang/workspace/xiaochengxu/massage-app
```

### Development
```bash
npm run dev:api      # WeChat mini-program with production API (recommended)
npm run dev:weapp    # WeChat mini-program with local API (localhost:3001)
npm run dev:h5:api   # H5 browser development with hot reload (port 8081)
npm run dev:h5       # H5 with local API
```

### Build
```bash
npm run build:weapp  # Production build for WeChat
npm run build:h5     # Production build for H5
```

### Testing
```bash
npm test                              # Run all tests
npm test -- --watch                   # Watch mode
npm test -- therapist.service.test    # Run specific test file
npm test -- --testNamePattern="pattern"  # Run tests matching pattern
```

### Code Quality
```bash
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
1. **Check API Documentation**: Always read `api-docs/` folder first for endpoint specifications
2. Ensure backend implements TypeScript interfaces correctly
3. Configure endpoints in `src/config/api.ts`
4. Test with `npm run dev:api`
5. Handle error cases and loading states

### API Documentation Requirements
Before implementing any new API integration:
1. **Check `api-docs/` folder** for existing API specifications
2. If API documentation doesn't exist, request backend team to add it
3. **Required API documentation format:**

```markdown
# API Name - Endpoint Documentation

## Endpoint
`METHOD /api/v2/endpoint-path`

## Description
Brief description of what this API does

## Request Parameters
### Path Parameters
- `id` (string, required): Description

### Query Parameters
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

### Request Body
```json
{
  "field1": "string (required)",
  "field2": "number (optional)"
}
```

## Response Format
### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "ISO 8601 date string"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## TypeScript Interface
```typescript
interface ApiResponse {
  id: string;
  name: string;
  createdAt: string;
}

interface ApiRequest {
  field1: string;
  field2?: number;
}
```
```

**Important**: All API documentation must include TypeScript interfaces that match exactly with `src/types/index.ts`

## Testing Approach

- **Framework**: Jest with ts-jest
- **Service Testing**: Focus on business logic (see `therapist.service.test.ts`)
- **API Testing**: Test service layer with real API endpoints
- **Location Testing**: Distance calculations critical for nearby features

## Project Structure

```
xiaochengxu/                          # Root directory
├── massage-app/                      # Frontend (Taro 3.x + React + TypeScript)
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   │   ├── appointment/         # 预约页 (appointment, store, symptom, therapist)
│   │   │   ├── booking/             # 预约流程 (confirm, success)
│   │   │   ├── gift/                # 好礼页 (cards, products)
│   │   │   ├── mine/                # 我的页 (profile, balance, recharge)
│   │   │   └── order/               # 订单管理 (list, detail)
│   │   ├── components/              # Reusable UI components
│   │   ├── services/                # API service layer (store, therapist, order, etc.)
│   │   │   └── __tests__/           # Service unit tests
│   │   ├── types/                   # TypeScript interfaces (index.ts, voucher.ts)
│   │   ├── config/                  # Configuration (api.ts)
│   │   ├── utils/                   # Utilities (request.ts, location.ts, user.ts)
│   │   └── mock/                    # Mock data for development
│   ├── config/                      # Taro build configuration
│   ├── dist/                        # Build output (WeChat/H5)
│   ├── jest.config.js               # Test configuration
│   ├── package.json                 # Dependencies and scripts
│   └── project.config.json          # WeChat mini-program settings
├── backend/                          # Backend services
│   └── database/                    # SQLite database files
├── api-docs/                         # API specifications (⚠️ READ FIRST)
│   ├── 00-通用规范.md
│   ├── 01-门店API.md
│   ├── 02-推拿师API.md
│   ├── 03-预约API.md
│   ├── 04-用户API.md
│   ├── 06-订单支付API.md
│   ├── 07-评价API.md
│   └── 08-微信手机号API.md
└── docs/                             # Product and architecture docs
    ├── 产品需求文档PRD.md
    ├── 技术架构设计文档.md
    └── 数据库设计文档.md
```

## Critical Implementation Details

### Location-Based Features
- Distance calculation uses Haversine formula (`utils/location.ts`)
- Therapist recommendations sorted by distance + rating
- Store listing prioritizes proximity
- API returns `latitude`/`longitude` directly on Store objects (not nested in `location` property)

### Environment Configuration
- API endpoint controlled by `TARO_APP_API` environment variable
- Production API: `http://emagen.323424.xyz/api/v2` (default)
- Local API: `http://localhost:3001/api/v2` (for backend development)
- Configuration in `src/config/api.ts`

### Error Handling Patterns
- Service layer catches errors and logs them with context (e.g., `console.log('⚠️ API调用失败:', error)`)
- Services provide fallback behavior when APIs fail (e.g., return empty arrays or default time slots)
- Request layer (`utils/request.ts`) throws errors with response data attached for upper layers to handle
- API responses follow format: `{ code: 0, message: 'success', data: T }`

### Payment and Wallet System
- All amounts stored in **cents** (分), not yuan (e.g., 10000 = 100 yuan)
- Wallet balance supports both `balance` and `frozenBalance`
- Payment methods: `wechat` (WeChat Pay) or `balance` (wallet balance)
- Order types: `service` (booking), `product` (gift shop), `recharge` (top-up)
- WeChat Pay integration returns `wxPayParams` for mini-program payment API

## Key Files to Understand

### Critical Files (Read First)
1. **`api-docs/README.md`** - API overview and quick start (⚠️ ALWAYS read before implementation)
2. **`massage-app/src/types/index.ts`** - Complete TypeScript type definitions for all models
3. **`massage-app/src/config/api.ts`** - API endpoint configuration
4. **`massage-app/src/utils/request.ts`** - HTTP request wrapper with error handling

### Architecture Examples
5. **`massage-app/src/services/therapist.ts`** - Service layer pattern with location-based logic
6. **`massage-app/src/services/wallet.service.ts`** - Wallet and balance management
7. **`massage-app/src/services/order.ts`** - Order creation and payment flow
8. **`massage-app/src/utils/location.ts`** - Haversine distance calculations

### Page Flow Examples
9. **`massage-app/src/pages/appointment/`** - Main appointment page and store/therapist selection
10. **`massage-app/src/pages/booking/confirm/`** - Booking confirmation flow
11. **`massage-app/src/pages/mine/recharge/`** - Balance recharge with WeChat Pay integration

## Common Patterns and Best Practices

### Service Layer Pattern
All business logic lives in `src/services/`:
```typescript
class TherapistService {
  async getRecommendedTherapists(page, pageSize, userLocation) {
    const data = await request('/therapists/recommended', { data: {...} })
    return data.data // Extract data from ApiResponse wrapper
  }
}
export const therapistService = new TherapistService()
```

### Type Safety
- Always import types from `@/types` or `@/types/index`
- Use `PageData<T>` for paginated responses
- Use `ApiResponse<T>` for API responses
- Never use `any` - define proper interfaces

### API Response Unwrapping
Backend returns: `{ code: 0, message: 'success', data: {...} }`
Services should return `data.data` to pages, not the full response.

### Distance Calculation
```typescript
// Services that need distance must:
// 1. Get user location from getLocationService
// 2. Fetch items with location data
// 3. Calculate distance for each item
// 4. Sort by distance (null values last)
```

### Testing Strategy
- Test files in `src/services/__tests__/`
- Focus on business logic, not API mocking
- Use real API endpoints when possible
- Test distance calculations with realistic coordinates

### User Management
- User identification via phone number (WeChat phone binding)
- User ID stored in localStorage/Taro.storage after login
- Balance operations require valid userId
- Check user exists in remote DB before operations (see debugging section)

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

## 🔍 Remote Server and Database Debugging Guide

### Environment Architecture

#### Database Environments
- **Local Database**: `/home/chengliang/workspace/xiaochengxu/backend/database/mingyi.db`
  - Used for local development and testing
  - Data is independent and does not sync with remote

- **Remote Database**: Deployed on server
  - API Address: `http://emagen.323424.xyz/api/v2`
  - Production environment data
  - Frontend connects to this by default

⚠️ **Important**: Local database and remote database data are independent and do not sync automatically!

### Common Issues and Solutions

#### 1. User Does Not Exist Error (500/404)
**Problem**:
```
GET http://emagen.323424.xyz/api/v2/users/wallet/balance?userId=35
500 (Internal Server Error)
```

**Root Cause**:
- User ID does not exist in remote database
- Users created locally do not sync to remote
- Frontend cached incorrect user ID

**Solution**:
```bash
# 1. Verify if user exists
curl -X GET "http://emagen.323424.xyz/api/v2/users/info?phone=手机号"

# 2. Create user (via bind-phone endpoint)
curl -X POST "http://emagen.323424.xyz/api/v2/users/bind-phone" \
  -H "Content-Type: application/json" \
  -d '{
    "openid": "wx_test_xxx",
    "phone": "手机号",
    "sessionKey": "test_session_key"
  }'
```

#### 2. Data Synchronization Issues
**Symptoms**:
- Local database operations succeed but API queries fail
- Cannot see recharge/user creation in frontend

**Diagnostic Steps**:
```bash
# Check remote API user
curl "http://emagen.323424.xyz/api/v2/users/info?phone=19357509502"

# Check local database
python3 -c "
import sqlite3
conn = sqlite3.connect('/home/chengliang/workspace/xiaochengxu/backend/database/mingyi.db')
cursor = conn.cursor()
cursor.execute('SELECT * FROM users WHERE phone=?', ('19357509502',))
print(cursor.fetchone())
"
```

### API Debugging Commands

#### User Management
```bash
# Get user info
curl -X GET "http://emagen.323424.xyz/api/v2/users/info?phone=13800138000"

# Create user (bind phone)
curl -X POST "http://emagen.323424.xyz/api/v2/users/bind-phone" \
  -H "Content-Type: application/json" \
  -d '{"openid": "wx_test_xxx", "phone": "手机号", "sessionKey": "test"}'

# Check balance
curl -X GET "http://emagen.323424.xyz/api/v2/users/wallet/balance?userId=1"
```

#### Recharge Operations
```bash
# Create recharge order
curl -X POST "http://emagen.323424.xyz/api/v2/orders/create" \
  -H "Content-Type: application/json" \
  -d '{
    "orderType": "recharge",
    "userId": 1,
    "title": "充值1000元",
    "amount": 100000,
    "paymentMethod": "wechat",
    "extraData": {
      "rechargeAmount": 100000,
      "bonus": 10000,
      "actualAmount": 110000
    }
  }'
```