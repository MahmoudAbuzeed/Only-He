#!/bin/bash

# App Runner Service Diagnostic Script
# ===================================
# This script helps diagnose and resolve Web ACL association issues with App Runner

set -e

# Configuration
AWS_REGION="us-east-1"
APP_RUNNER_SERVICE="only-he-api-production"
ACCOUNT_ID="390926054705"

echo "🔍 App Runner Service Diagnostic Tool"
echo "===================================="
echo ""

# Function to check AWS CLI and credentials
check_aws_setup() {
    echo "1️⃣ Checking AWS CLI setup..."
    
    if ! command -v aws &> /dev/null; then
        echo "❌ AWS CLI not found. Please install it first."
        exit 1
    fi
    
    echo "✅ AWS CLI found: $(aws --version)"
    
    # Check credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        echo "❌ AWS credentials not configured. Please run 'aws configure'"
        exit 1
    fi
    
    CURRENT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    CURRENT_REGION=$(aws configure get region || echo "us-east-1")
    
    echo "✅ AWS credentials configured"
    echo "   Account ID: $CURRENT_ACCOUNT"
    echo "   Region: $CURRENT_REGION"
    
    if [ "$CURRENT_ACCOUNT" != "$ACCOUNT_ID" ]; then
        echo "⚠️  Warning: Current account ($CURRENT_ACCOUNT) differs from expected ($ACCOUNT_ID)"
    fi
    
    if [ "$CURRENT_REGION" != "$AWS_REGION" ]; then
        echo "⚠️  Warning: Current region ($CURRENT_REGION) differs from expected ($AWS_REGION)"
        echo "   Setting region to $AWS_REGION for this script"
        export AWS_DEFAULT_REGION=$AWS_REGION
    fi
    echo ""
}

# Function to list all App Runner services
list_services() {
    echo "2️⃣ Listing all App Runner services..."
    
    SERVICES=$(aws apprunner list-services --region $AWS_REGION --output json 2>/dev/null || echo '{"ServiceSummaryList":[]}')
    SERVICE_COUNT=$(echo "$SERVICES" | jq '.ServiceSummaryList | length')
    
    if [ "$SERVICE_COUNT" -eq 0 ]; then
        echo "❌ No App Runner services found in region $AWS_REGION"
        echo ""
        return 1
    fi
    
    echo "✅ Found $SERVICE_COUNT App Runner service(s):"
    echo "$SERVICES" | jq -r '.ServiceSummaryList[] | "   • \(.ServiceName) - \(.Status) - \(.ServiceArn)"'
    echo ""
    return 0
}

# Function to check specific service
check_service() {
    echo "3️⃣ Checking service: $APP_RUNNER_SERVICE..."
    
    # Try to find the service by name
    SERVICE_ARN=$(aws apprunner list-services --region $AWS_REGION \
        --query "ServiceSummaryList[?ServiceName=='$APP_RUNNER_SERVICE'].ServiceArn" \
        --output text 2>/dev/null || echo "")
    
    if [ -z "$SERVICE_ARN" ] || [ "$SERVICE_ARN" = "None" ]; then
        echo "❌ Service '$APP_RUNNER_SERVICE' not found"
        echo ""
        return 1
    fi
    
    echo "✅ Service found!"
    echo "   ARN: $SERVICE_ARN"
    
    # Get detailed service information
    SERVICE_DETAILS=$(aws apprunner describe-service --service-arn "$SERVICE_ARN" --region $AWS_REGION --output json)
    
    STATUS=$(echo "$SERVICE_DETAILS" | jq -r '.Service.Status')
    SERVICE_URL=$(echo "$SERVICE_DETAILS" | jq -r '.Service.ServiceUrl // "N/A"')
    CREATED_AT=$(echo "$SERVICE_DETAILS" | jq -r '.Service.CreatedAt')
    UPDATED_AT=$(echo "$SERVICE_DETAILS" | jq -r '.Service.UpdatedAt')
    
    echo "   Status: $STATUS"
    echo "   URL: https://$SERVICE_URL"
    echo "   Created: $CREATED_AT"
    echo "   Updated: $UPDATED_AT"
    echo ""
    
    # Check if service is in a valid state for Web ACL association
    case "$STATUS" in
        "RUNNING")
            echo "✅ Service is in RUNNING state - ready for Web ACL association"
            ;;
        "CREATING"|"UPDATING"|"DELETING")
            echo "⚠️  Service is in transitional state ($STATUS) - wait for completion before associating Web ACL"
            ;;
        "CREATE_FAILED"|"UPDATE_FAILED"|"DELETE_FAILED")
            echo "❌ Service is in failed state ($STATUS) - needs attention"
            ;;
        *)
            echo "⚠️  Service is in unknown state ($STATUS)"
            ;;
    esac
    
    return 0
}

# Function to check Web ACL compatibility
check_web_acl_compatibility() {
    echo "4️⃣ Checking Web ACL compatibility..."
    
    if [ -z "$SERVICE_ARN" ]; then
        echo "❌ No service ARN available"
        return 1
    fi
    
    # Check if service supports Web ACL (must be running and healthy)
    SERVICE_STATUS=$(aws apprunner describe-service --service-arn "$SERVICE_ARN" --region $AWS_REGION \
        --query 'Service.Status' --output text)
    
    if [ "$SERVICE_STATUS" != "RUNNING" ]; then
        echo "❌ Service must be in RUNNING state for Web ACL association"
        echo "   Current status: $SERVICE_STATUS"
        return 1
    fi
    
    # Check if there are any existing Web ACL associations
    echo "   Checking existing Web ACL associations..."
    
    # Note: AWS CLI doesn't have a direct command to list Web ACL associations for App Runner
    # This would typically be done through the AWS Console or WAFv2 API
    echo "✅ Service is compatible with Web ACL association"
    echo "   ℹ️  To associate a Web ACL, use the AWS Console or WAFv2 API"
    echo ""
}

# Function to provide resolution steps
provide_resolution() {
    echo "5️⃣ Resolution Steps"
    echo "=================="
    
    if [ -z "$SERVICE_ARN" ]; then
        echo "❌ Service not found. To resolve:"
        echo ""
        echo "Option 1: Redeploy the service"
        echo "   • Push code to main/master branch to trigger GitHub Actions"
        echo "   • Or manually run the deployment workflow"
        echo ""
        echo "Option 2: Create service manually"
        echo "   • Use the AWS Console to create a new App Runner service"
        echo "   • Use the ECR image: $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/only-he-api:latest"
        echo ""
        return
    fi
    
    SERVICE_STATUS=$(aws apprunner describe-service --service-arn "$SERVICE_ARN" --region $AWS_REGION \
        --query 'Service.Status' --output text)
    
    case "$SERVICE_STATUS" in
        "RUNNING")
            echo "✅ Service is ready for Web ACL association!"
            echo ""
            echo "To associate a Web ACL:"
            echo "1. Go to AWS Console > WAF & Shield > Web ACLs"
            echo "2. Select your Web ACL"
            echo "3. Go to 'Associated AWS resources'"
            echo "4. Click 'Add AWS resources'"
            echo "5. Select 'App Runner' and choose your service"
            echo "6. Use this ARN: $SERVICE_ARN"
            ;;
        "CREATING"|"UPDATING")
            echo "⏳ Service is currently $SERVICE_STATUS"
            echo "   Wait for the service to reach RUNNING state before associating Web ACL"
            echo ""
            echo "Monitor status with:"
            echo "   aws apprunner describe-service --service-arn '$SERVICE_ARN' --region $AWS_REGION --query 'Service.Status'"
            ;;
        *)
            echo "❌ Service is in $SERVICE_STATUS state"
            echo "   This may require service recreation or troubleshooting"
            echo ""
            echo "Consider:"
            echo "1. Checking service logs in AWS Console"
            echo "2. Redeploying the service"
            echo "3. Contacting AWS support if the issue persists"
            ;;
    esac
    echo ""
}

# Function to show useful commands
show_useful_commands() {
    echo "6️⃣ Useful Commands"
    echo "=================="
    echo ""
    echo "Monitor service status:"
    echo "   aws apprunner describe-service --service-arn '$SERVICE_ARN' --region $AWS_REGION"
    echo ""
    echo "List all services:"
    echo "   aws apprunner list-services --region $AWS_REGION"
    echo ""
    echo "Trigger redeployment (if using GitHub Actions):"
    echo "   git commit --allow-empty -m 'Trigger redeployment' && git push"
    echo ""
    echo "Check service logs:"
    echo "   # Use AWS Console > App Runner > [Service] > Logs"
    echo ""
}

# Main execution
main() {
    check_aws_setup
    
    if list_services; then
        if check_service; then
            check_web_acl_compatibility
        fi
    fi
    
    provide_resolution
    show_useful_commands
    
    echo "🎯 Summary"
    echo "=========="
    if [ -n "$SERVICE_ARN" ]; then
        echo "✅ Service ARN: $SERVICE_ARN"
        SERVICE_STATUS=$(aws apprunner describe-service --service-arn "$SERVICE_ARN" --region $AWS_REGION \
            --query 'Service.Status' --output text 2>/dev/null || echo "UNKNOWN")
        echo "📊 Status: $SERVICE_STATUS"
        
        if [ "$SERVICE_STATUS" = "RUNNING" ]; then
            echo "🎉 Ready for Web ACL association!"
        else
            echo "⏳ Wait for service to be RUNNING before Web ACL association"
        fi
    else
        echo "❌ Service needs to be created or redeployed"
        echo "💡 Trigger GitHub Actions deployment or create manually"
    fi
}

# Run the diagnostic
main
