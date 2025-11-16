# smartlab-sandbox

## Table of Contents

- [Introduction](#introduction)
- [Architecture & Components](#architecture-components)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running](#running)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [License](#license)

## Introduction

SmartLab Sandbox is an IoT device management platform that enables automated control and monitoring of smart devices. The system is built with a microservices architecture, featuring a central gateway that orchestrates communication between various IoT devices and a web-based control interface.

The platform supports device discovery, real-time state synchronization, and automation rules that allow devices to respond to events from other devices.

## Architecture & Components

The project consists of several key components:

### Gateway (`/gateway`)

The central hub of the system. It handles:

- Device discovery and registration
- REST API for device and automation management
- Real-time socket.io events for instant UI updates
- Rule evaluation and automation execution
- JWT token-based authentication

### Devices

Multiple device types are supported, each running independently:

- **Light Bulb** (`/light`) - Smart lighting device with color, brightness, and power control
- **Motion Sensor** (`/motion-sensor`) - Detects motion and sends events
- **Thermometer** (`/thermometer`) - Temperature monitoring with heating control and mode selection (OFF, ECO, COMFORT)

Each device:

- Discovers and registers with the gateway
- Exposes a local API for state management
- Sends heartbeats to maintain connection
- Reports events and state changes

### Web Interface (`/web-interface`)

A Nuxt application that provides:

- Real-time device status monitoring
- Device control panels for each device type
- Automation rule creation and management

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development without Docker)
- PostgreSQL 14+ (included in Docker Compose)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd smartlab-sandbox
```

2. Install dependencies for each service (optional, if running without Docker):

```bash
# Gateway
cd gateway && pnpm install && cd ..

# Web Interface
cd web-interface && pnpm install && cd ..

# Light Device
cd light && pnpm install && cd ..

# Motion Sensor Device
cd motion-sensor && pnpm install && cd ..

# Thermometer Device
cd thermometer && pnpm install && cd ..
```

### Running

The easiest way to run the entire system is using Docker Compose:

```bash
docker-compose up
```

This will start all services:

- **Gateway** on `http://localhost:3001`
- **Web Interface** on `http://localhost:3000`
- **PostgreSQL Database** on `localhost:5432`
- **Devices** on their respective ports

The devices will automatically discover the gateway and register themselves.

To run in detached mode:

```bash
docker-compose up -d
```

To stop the services:

```bash
docker-compose down
```

## Configuration

Environment variables can be set in `.env` files in each service directory:

- **Gateway** (`.env`):

  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: Secret key for JWT tokens
  - `PORT`: Gateway server port (default: 3001)

- **Devices** (`.env`):
  - `DEVICE_ADDRESS`: Device's IP address and port

## Project Structure

```
smartlab-sandbox/
├── gateway/             # Central hub and API server
|   ├── prisma/          # Database schema
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── prisma/      # Database schema
│   │   └── index.ts     # Server setup
│   └── package.json
├── web-interface/       # Nuxt frontend
│   ├── app/
│   │   ├── components/  # Vue components
│   │   ├── pages/       # Routes
│   │   └── stores/      # Pinia stores
│   └── package.json
├── light/               # Smart light device
│   ├── src/
│   │   └── index.ts
│   └── package.json
├── motion-sensor/       # Motion detector device
│   ├── src/
│   │   └── index.ts
│   └── package.json
├── thermometer/         # Temperature controller device
│   ├── src/
│   │   └── index.ts
│   └── package.json
└── docker-compose.yml   # Docker Compose configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
