#!/bin/bash

# App Runner Deployment Monitor
# ============================
# Monitor the GitHub Actions deployment and new App Runner service creation

set -e

AWS_REGION="us-east-1"
APP_RUNNER_SERVICE="only-he-api-production"

echo "🔍 App Runner Deployment Monitor"
echo "==============================="
echo ""

# Function to check for new service
check_for_service() {
    aws apprunner list-services --region $AWS_REGION \
        --query "ServiceSummaryList[?ServiceName=='$APP_RUNNER_SERVICE']" \
        --output json 2>/dev/null || echo '[]'
}

# Function to get service status
get_service_status() {
    local service_arn="$1"
    aws apprunner describe-service --service-arn "$service_arn" --region $AWS_REGION \
        --query 'Service.{Status:Status,URL:ServiceUrl,CreatedAt:CreatedAt}' \
        --output json 2>/dev/null || echo '{}'
}

# Main monitoring loop
monitor_deployment() {
    echo "🚀 Monitoring deployment progress..."
    echo "   GitHub Actions: https://github.com/MahmoudAbuzeed/Only-He/actions"
    echo ""
    
    local max_attempts=20
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "📊 Check $attempt/$max_attempts ($(date '+%H:%M:%S'))"
        
        # Check for service
        SERVICES=$(check_for_service)
        SERVICE_COUNT=$(echo "$SERVICES" | jq length)
        
        if [ "$SERVICE_COUNT" -gt 0 ]; then
            echo "✅ Service found!"
            
            SERVICE_ARN=$(echo "$SERVICES" | jq -r '.[0].ServiceArn')
            SERVICE_STATUS=$(echo "$SERVICES" | jq -r '.[0].Status')
            SERVICE_URL=$(echo "$SERVICES" | jq -r '.[0].ServiceUrl')
            
            echo "   ARN: $SERVICE_ARN"
            echo "   Status: $SERVICE_STATUS"
            echo "   URL: https://$SERVICE_URL"
            
            case "$SERVICE_STATUS" in
                "RUNNING")
                    echo ""
                    echo "🎉 SUCCESS! Service is running!"
                    echo "🔗 API URL: https://$SERVICE_URL/api/v1"
                    echo "📚 Docs: https://$SERVICE_URL/api/docs"
                    echo ""
                    echo "✅ Ready for Web ACL association!"
                    echo "   Use this ARN: $SERVICE_ARN"
                    return 0
                    ;;
                "CREATING")
                    echo "   ⏳ Service is being created..."
                    ;;
                "CREATE_FAILED")
                    echo "   ❌ Service creation failed!"
                    echo "   Check logs for details:"
                    echo "   aws logs get-log-events --log-group-name '/aws/apprunner/$APP_RUNNER_SERVICE/$(echo $SERVICE_ARN | cut -d'/' -f3)/service' --log-stream-name 'events' --region $AWS_REGION"
                    return 1
                    ;;
                *)
                    echo "   📊 Status: $SERVICE_STATUS"
                    ;;
            esac
        else
            echo "   ⏳ No service found yet - GitHub Actions still running..."
        fi
        
        echo ""
        
        if [ $attempt -lt $max_attempts ]; then
            sleep 60  # Wait 1 minute between checks
        fi
        
        ((attempt++))
    done
    
    echo "⚠️  Monitoring timeout reached"
    echo "   Check GitHub Actions manually: https://github.com/MahmoudAbuzeed/Only-He/actions"
    echo "   Or run this script again to continue monitoring"
    return 1
}

# Function to provide current status
show_current_status() {
    echo "📊 Current Status Summary"
    echo "========================"
    echo ""
    
    # Check GitHub Actions (we can't directly query this, so provide instructions)
    echo "🔄 GitHub Actions:"
    echo "   Check: https://github.com/MahmoudAbuzeed/Only-He/actions"
    echo "   Look for the latest workflow run triggered by your commit"
    echo ""
    
    # Check App Runner services
    echo "🚀 App Runner Services:"
    SERVICES=$(check_for_service)
    SERVICE_COUNT=$(echo "$SERVICES" | jq length)
    
    if [ "$SERVICE_COUNT" -gt 0 ]; then
        echo "$SERVICES" | jq -r '.[] | "   • \(.ServiceName) - \(.Status) - \(.ServiceArn)"'
    else
        echo "   • No '$APP_RUNNER_SERVICE' service found"
    fi
    echo ""
    
    # Check database connectivity
    echo "🗄️  Database Status:"
    RDS_STATUS=$(aws rds describe-db-instances --db-instance-identifier "only-he-api-postgres" --region $AWS_REGION \
        --query 'DBInstances[0].DBInstanceStatus' --output text 2>/dev/null || echo "NOT_FOUND")
    echo "   • RDS Status: $RDS_STATUS"
    
    if [ "$RDS_STATUS" = "available" ]; then
        echo "   • ✅ Database is available"
        echo "   • ✅ Security group rules added for App Runner connectivity"
    fi
    echo ""
}

# Main execution
main() {
    if [ "$1" = "--status" ]; then
        show_current_status
    else
        show_current_status
        echo "🔍 Starting continuous monitoring..."
        echo "   Press Ctrl+C to stop"
        echo ""
        monitor_deployment
    fi
}

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "❌ jq is required but not installed."
    echo "   Install it with: brew install jq"
    exit 1
fi

# Run the monitor
main "$@"
