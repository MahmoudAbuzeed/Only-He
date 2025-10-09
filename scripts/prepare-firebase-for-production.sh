#!/bin/bash

# Prepare Firebase credentials for production deployment
# This script creates a minified version of Firebase credentials for AWS App Runner

echo "🔧 Preparing Firebase credentials for production..."

# Check if firebase-service-account.json exists
if [ ! -f "firebase-service-account.json" ]; then
    echo "❌ Error: firebase-service-account.json not found!"
    echo "Please make sure the Firebase service account file is in the project root."
    exit 1
fi

echo "✅ Found firebase-service-account.json"

# Minify the JSON (remove all whitespace and newlines)
echo ""
echo "📦 Minifying JSON for production..."
MINIFIED_JSON=$(cat firebase-service-account.json | tr -d '\n\r' | tr -s ' ')

echo "✅ JSON minified successfully"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 PRODUCTION ENVIRONMENT VARIABLE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Variable Name: FIREBASE_SERVICE_ACCOUNT"
echo ""
echo "Variable Value (copy this):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$MINIFIED_JSON"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Instructions for AWS App Runner:"
echo ""
echo "1. Go to AWS App Runner Console"
echo "2. Select your service: Only-He"
echo "3. Configuration → Environment variables"
echo "4. Add/Edit variable:"
echo "   - Name: FIREBASE_SERVICE_ACCOUNT"
echo "   - Value: (paste the JSON above)"
echo "5. Click 'Save'"
echo "6. Deploy your service"
echo ""
echo "✅ Firebase will be configured in production!"
echo ""

