#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

bash "$SCRIPT_DIR/setup.sh"

if [ $? -eq 0 ]; then
    echo ""
    echo "Starting dashboard..."
    bash "$SCRIPT_DIR/run-dashboard.sh"
fi
