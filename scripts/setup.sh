#!/bin/bash

echo "========================================"
echo "ESP8266 MQTT Temperature Monitor Setup"
echo "========================================"
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed!"
    echo "Please install Docker from https://www.docker.com/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "ERROR: Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "Docker found: $(docker --version)"
echo ""

echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js found: $(node --version)"
echo ""

echo "Starting MQTT broker (Docker)..."
cd "$PROJECT_DIR"

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "ERROR: docker-compose is not installed!"
    exit 1
fi

if docker compose version &> /dev/null; then
    docker compose up -d
else
    docker-compose up -d
fi

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to start MQTT broker!"
    exit 1
fi

echo "MQTT broker started successfully!"
echo ""

echo "Installing dashboard dependencies..."
cd "$PROJECT_DIR/dashboard"

if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dashboard dependencies!"
        exit 1
    fi
    echo "Dashboard dependencies installed!"
else
    echo "Dashboard dependencies already installed."
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "MQTT Broker:"
echo "  - MQTT Port: 1883"
echo "  - WebSocket Port: 9001"
echo ""
echo "To start the dashboard, run:"
echo "  ./scripts/run-dashboard.sh"
echo ""
