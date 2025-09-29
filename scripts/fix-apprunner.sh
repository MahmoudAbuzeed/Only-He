#!/bin/bash

# App Runner Service Fix Script
# ============================
# This script fixes the CREATE_FAILED App Runner service by deleting and recreating it

set -e

# Configuration
AWS_REGION="us-east-1"
APP_RUNNER_SERVICE="only-he-api-production"
FAILED_SERVICE_ARN="arn:aws:apprunner:us-east-1:390926054705:service/only-he-api-production/14e56399eb46444b857cc83c2132fab8"

echo "🔧 App Runner Service Fix Tool"
echo "============================="
echo ""

# Function to check service status
check_service_status() {
    local service_arn="$1"
    aws apprunner describe-service --service-arn "$service_arn" --region $AWS_REGION \
        --query 'Service.Status' --output text 2>/dev/null || echo "NOT_FOUND"
}

# Function to delete failed service
delete_failed_service() {
    echo "1️⃣ Deleting failed App Runner service..."
    echo "   ARN: $FAILED_SERVICE_ARN"
    
    STATUS=$(check_service_status "$FAILED_SERVICE_ARN")
    
    if [ "$STATUS" = "NOT_FOUND" ]; then
        echo "✅ Service already deleted or doesn't exist"
        return 0
    fi
    
    if [ "$STATUS" != "CREATE_FAILED" ]; then
        echo "⚠️  Service status is $STATUS, not CREATE_FAILED"
        echo "   Are you sure you want to delete it? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            echo "❌ Operation cancelled"
            exit 1
        fi
    fi
    
    echo "🗑️  Deleting service..."
    aws apprunner delete-service \
        --service-arn "$FAILED_SERVICE_ARN" \
        --region $AWS_REGION
    
    echo "⏳ Waiting for service deletion to complete..."
    
    # Wait for deletion to complete (max 10 minutes)
    for i in {1..20}; do
        STATUS=$(check_service_status "$FAILED_SERVICE_ARN")
        
        if [ "$STATUS" = "NOT_FOUND" ]; then
            echo "✅ Service successfully deleted!"
            break
        elif [ "$STATUS" = "DELETE_FAILED" ]; then
            echo "❌ Service deletion failed!"
            echo "   You may need to delete it manually from the AWS Console"
            exit 1
        else
            echo "   Deletion in progress... (status: $STATUS, attempt $i/20)"
            sleep 30
        fi
    done
    
    if [ "$STATUS" != "NOT_FOUND" ]; then
        echo "⚠️  Deletion is taking longer than expected"
        echo "   Current status: $STATUS"
        echo "   You may need to wait longer or check the AWS Console"
        exit 1
    fi
    
    echo ""
}

# Function to trigger redeployment
trigger_redeployment() {
    echo "2️⃣ Triggering redeployment via GitHub Actions..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "❌ Not in a git repository"
        echo "   Please navigate to your project directory and run this script again"
        exit 1
    fi
    
    # Check if there are uncommitted changes
    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo "⚠️  You have uncommitted changes"
        echo "   Commit them first or they will be lost"
        echo "   Continue anyway? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            echo "❌ Operation cancelled"
            exit 1
        fi
    fi
    
    # Create an empty commit to trigger deployment
    echo "📝 Creating deployment trigger commit..."
    git commit --allow-empty -m "fix: trigger App Runner service recreation after CREATE_FAILED

- Deleted failed service: $FAILED_SERVICE_ARN
- Triggering GitHub Actions deployment to recreate service
- This should resolve Web ACL association issues"
    
    echo "📤 Pushing to trigger GitHub Actions..."
    CURRENT_BRANCH=$(git branch --show-current)
    git push origin "$CURRENT_BRANCH"
    
    echo "✅ Deployment triggered!"
    echo "   Monitor progress at: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\\([^.]*\\).*/\\1/')/actions"
    echo ""
}

# Function to monitor new deployment
monitor_deployment() {
    echo "3️⃣ Monitoring new service creation..."
    echo "   This may take 10-15 minutes..."
    echo ""
    
    # Wait a bit for GitHub Actions to start
    echo "⏳ Waiting for GitHub Actions to start deployment..."
    sleep 60
    
    # Monitor for new service creation
    for i in {1..30}; do
        echo "   Checking for new service... (attempt $i/30)"
        
        # List services and look for our service name
        NEW_SERVICE_ARN=$(aws apprunner list-services --region $AWS_REGION \
            --query "ServiceSummaryList[?ServiceName=='$APP_RUNNER_SERVICE'].ServiceArn" \
            --output text 2>/dev/null || echo "")
        
        if [ -n "$NEW_SERVICE_ARN" ] && [ "$NEW_SERVICE_ARN" != "None" ]; then
            if [ "$NEW_SERVICE_ARN" != "$FAILED_SERVICE_ARN" ]; then
                echo "✅ New service detected!"
                echo "   New ARN: $NEW_SERVICE_ARN"
                
                # Check status
                STATUS=$(check_service_status "$NEW_SERVICE_ARN")
                echo "   Status: $STATUS"
                
                if [ "$STATUS" = "RUNNING" ]; then
                    echo "🎉 Service is running and ready for Web ACL association!"
                    
                    # Get service URL
                    SERVICE_URL=$(aws apprunner describe-service --service-arn "$NEW_SERVICE_ARN" --region $AWS_REGION \
                        --query 'Service.ServiceUrl' --output text)
                    echo "   URL: https://$SERVICE_URL"
                    
                    return 0
                elif [ "$STATUS" = "CREATE_FAILED" ]; then
                    echo "❌ New service also failed to create"
                    echo "   This indicates a deeper issue that needs investigation"
                    return 1
                else
                    echo "⏳ Service is still being created (status: $STATUS)"
                fi
            fi
        fi
        
        sleep 30
    done
    
    echo "⚠️  Service creation is taking longer than expected"
    echo "   Check GitHub Actions and AWS Console for more details"
    return 1
}

# Function to provide final instructions
provide_final_instructions() {
    echo "4️⃣ Final Steps for Web ACL Association"
    echo "======================================"
    echo ""
    
    # Get the current service ARN
    CURRENT_SERVICE_ARN=$(aws apprunner list-services --region $AWS_REGION \
        --query "ServiceSummaryList[?ServiceName=='$APP_RUNNER_SERVICE'].ServiceArn" \
        --output text 2>/dev/null || echo "")
    
    if [ -n "$CURRENT_SERVICE_ARN" ] && [ "$CURRENT_SERVICE_ARN" != "None" ]; then
        STATUS=$(check_service_status "$CURRENT_SERVICE_ARN")
        
        if [ "$STATUS" = "RUNNING" ]; then
            echo "✅ Your service is ready for Web ACL association!"
            echo ""
            echo "🔗 Service ARN: $CURRENT_SERVICE_ARN"
            echo ""
            echo "📋 To associate a Web ACL:"
            echo "1. Go to AWS Console > WAF & Shield > Web ACLs"
            echo "2. Select your Web ACL"
            echo "3. Go to 'Associated AWS resources' tab"
            echo "4. Click 'Add AWS resources'"
            echo "5. Select 'App Runner' from the dropdown"
            echo "6. Choose your service: $APP_RUNNER_SERVICE"
            echo "7. Click 'Add'"
            echo ""
            echo "🎯 The Web ACL association should now work successfully!"
        else
            echo "⏳ Service status: $STATUS"
            echo "   Wait for the service to reach RUNNING state before associating Web ACL"
            echo ""
            echo "Monitor with:"
            echo "   aws apprunner describe-service --service-arn '$CURRENT_SERVICE_ARN' --region $AWS_REGION"
        fi
    else
        echo "❌ Service not found. Check GitHub Actions deployment status."
    fi
    echo ""
}

# Main execution
main() {
    echo "🎯 This script will:"
    echo "   1. Delete the failed App Runner service"
    echo "   2. Trigger GitHub Actions to recreate the service"
    echo "   3. Monitor the new deployment"
    echo "   4. Provide Web ACL association instructions"
    echo ""
    echo "⚠️  WARNING: This will cause temporary downtime for your API"
    echo ""
    echo "Continue? (y/N)"
    read -r response
    
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Operation cancelled"
        exit 0
    fi
    
    delete_failed_service
    trigger_redeployment
    monitor_deployment
    provide_final_instructions
    
    echo "🎉 App Runner service fix completed!"
    echo "   Your service should now be ready for Web ACL association."
}

# Check if jq is available (needed for JSON parsing)
if ! command -v jq &> /dev/null; then
    echo "❌ jq is required but not installed."
    echo "   Install it with: brew install jq"
    exit 1
fi

# Run the fix
main
