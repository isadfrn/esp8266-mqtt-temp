#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_DIR/dashboard"

echo "Starting dashboard..."
echo "Dashboard will be available at http://localhost:5173"
echo ""

npm run dev
