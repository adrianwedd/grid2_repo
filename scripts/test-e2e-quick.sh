#!/bin/bash

# Quick E2E test runner for development
echo "Running quick E2E tests..."

# Run only AI Director API tests
npm run test:e2e -- --project=chromium --grep="AI Director"