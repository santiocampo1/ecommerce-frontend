# E-Commerce Frontend - Event-Driven Demo

React frontend that demonstrates event-driven architecture integration with NestJS backend.

## Features

- 🔐 JWT Authentication
- 📦 Product creation (triggers `product.created` event)
- ✅ Product activation (triggers `product.activated` event)
- 📊 Real-time inventory updates via polling
- 🎨 Modern, responsive UI
- ⚡ Async event flow demonstration

## Prerequisites

- Node.js 18+ 
- Backend running on http://localhost:3000

## Installation
```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `VITE_API_URL` if backend runs on different port

## Running the App
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. Click "Login as Admin" (credentials: admin@admin.com / 12345678)
2. Create a product:
   - Select category → Click "Create Product"
   - Backend emits `product.created` event
   - InventoryListener creates initial stock asynchronously
3. Add product details
4. Activate product:
   - Backend emits `product.activated` event
   - Check backend logs for event processing
5. Observe inventory badge update every 5 seconds (polling)

## Architecture

- **Polling Strategy**: Inventory badge polls `/inventory/product/:id` every 5 seconds
- **Event Demonstration**: UI shows the result of async event processing
- **Token Management**: JWT stored in localStorage with expiration check

## Tech Stack

- React 18
- Vite 5
- Axios (HTTP client)
- CSS3 (custom styling, no framework)

## Event Flow Demonstrated
```
User creates product
  ↓
POST /product/create
  ↓
Backend emits product.created event
  ↓
InventoryListener creates stock (async)
  ↓
Frontend polls inventory endpoint
  ↓
UI shows updated stock badge
```
