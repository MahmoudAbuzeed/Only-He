#!/bin/bash

# Create Web ACL for Only-He API Protection
# ========================================

set -e

AWS_REGION="us-east-1"
WEB_ACL_NAME="only-he-api-protection"

echo "🛡️ Creating Web ACL for Only-He API Protection"
echo "=============================================="
echo ""

# Create the Web ACL
echo "📝 Creating Web ACL with basic protection rules..."

aws wafv2 create-web-acl \
  --name "$WEB_ACL_NAME" \
  --scope "REGIONAL" \
  --default-action "Allow={}" \
  --description "Web ACL for Only-He e-commerce API protection against common attacks" \
  --visibility-config "SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=OnlyHeAPIWebACL" \
  --rules '[
    {
      "Name": "AWSManagedRulesCoreRuleSet",
      "Priority": 1,
      "OverrideAction": {"None": {}},
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesCoreRuleSet"
        }
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "AWSManagedRulesCoreRuleSet"
      }
    },
    {
      "Name": "AWSManagedRulesKnownBadInputsRuleSet",
      "Priority": 2,
      "OverrideAction": {"None": {}},
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesKnownBadInputsRuleSet"
        }
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "AWSManagedRulesKnownBadInputsRuleSet"
      }
    },
    {
      "Name": "AWSManagedRulesAmazonIpReputationList",
      "Priority": 3,
      "OverrideAction": {"None": {}},
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesAmazonIpReputationList"
        }
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "AWSManagedRulesAmazonIpReputationList"
      }
    },
    {
      "Name": "RateLimitRule",
      "Priority": 4,
      "Action": {"Block": {}},
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "RateLimitRule"
      }
    }
  ]' \
  --region $AWS_REGION > web-acl-response.json

echo "✅ Web ACL created successfully!"
echo ""

# Extract Web ACL details
WEB_ACL_ARN=$(cat web-acl-response.json | jq -r '.Summary.ARN')
WEB_ACL_ID=$(cat web-acl-response.json | jq -r '.Summary.Id')

echo "📊 Web ACL Details:"
echo "   Name: $WEB_ACL_NAME"
echo "   ID: $WEB_ACL_ID"
echo "   ARN: $WEB_ACL_ARN"
echo ""

echo "🛡️ Protection Rules Added:"
echo "   ✅ Core Rule Set (OWASP Top 10 protection)"
echo "   ✅ Known Bad Inputs (SQL injection, XSS)"
echo "   ✅ IP Reputation List (Known malicious IPs)"
echo "   ✅ Rate Limiting (2000 requests per 5 minutes per IP)"
echo ""

echo "🔗 Next Step: Associate with App Runner Service"
echo "   Service ARN: arn:aws:apprunner:us-east-1:390926054705:service/only-he-api-production/a0fb0d38bdf84d069192081979fbbd9d"
echo ""

# Clean up temporary file
rm -f web-acl-response.json

echo "🎉 Web ACL ready for association!"
