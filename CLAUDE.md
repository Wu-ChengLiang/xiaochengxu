# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

推拿预约小程序 (Massage Appointment Mini-Program) - A WeChat mini-program built with Taro 3.x + React + TypeScript, following a Mock-Driven Development approach. The frontend operates independently via a comprehensive mock data layer that defines API contracts.

## Essential Commands

```bash
# Development
npm run dev:weapp    # Start with mock data (default)
npm run dev:api      # Start with real API

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
- API switching via `TARO_APP_USE_MOCK` environment variable
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
- Mock mode controlled by `TARO_APP_USE_MOCK` environment variable
- API base URL configurable in `src/config/api.ts`
- Service layer automatically switches based on environment

## Key Files to Understand

1. **`src/types/index.ts`** - Complete data model definitions
2. **`src/services/therapist.service.ts`** - Service layer pattern example
3. **`src/config/api.ts`** - API configuration and switching logic
4. **`src/mock/data/`** - Mock data structure and relationships
5. **`src/pages/appointment/`** - Core booking flow implementation