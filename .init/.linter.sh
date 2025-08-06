#!/bin/bash
cd /home/kavia/workspace/code-generation/web-based-ipod-simulator-1200-1209/ipod_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

