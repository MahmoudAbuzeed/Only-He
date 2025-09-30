#!/bin/bash

# Create S3 Bucket for Image Storage
# ==================================

set -e

AWS_REGION="us-east-1"
BUCKET_NAME="only-he-images"

echo "🪣 Creating S3 Bucket for Only-He Images"
echo "========================================"
echo ""

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure'"
    exit 1
fi

echo "✅ AWS CLI configured"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "   Account ID: $ACCOUNT_ID"
echo ""

# Check if bucket already exists
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "✅ Bucket '$BUCKET_NAME' already exists"
else
    echo "🆕 Creating S3 bucket: $BUCKET_NAME"
    
    # Create bucket
    aws s3api create-bucket \
        --bucket "$BUCKET_NAME" \
        --region "$AWS_REGION" \
        --create-bucket-configuration LocationConstraint="$AWS_REGION" 2>/dev/null || \
    aws s3api create-bucket \
        --bucket "$BUCKET_NAME" \
        --region "$AWS_REGION" 2>/dev/null
    
    echo "✅ Bucket created successfully"
fi

echo ""
echo "🔧 Configuring bucket settings..."

# Enable versioning
echo "📝 Enabling versioning..."
aws s3api put-bucket-versioning \
    --bucket "$BUCKET_NAME" \
    --versioning-configuration Status=Enabled

# Set up CORS configuration for web access
echo "🌐 Setting up CORS configuration..."
cat > /tmp/cors-config.json << EOF
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000
        }
    ]
}
EOF

aws s3api put-bucket-cors \
    --bucket "$BUCKET_NAME" \
    --cors-configuration file:///tmp/cors-config.json

# Set up lifecycle policy to manage old versions
echo "♻️  Setting up lifecycle policy..."
cat > /tmp/lifecycle-policy.json << EOF
{
    "Rules": [
        {
            "ID": "DeleteOldVersions",
            "Status": "Enabled",
            "NoncurrentVersionExpiration": {
                "NoncurrentDays": 30
            }
        },
        {
            "ID": "DeleteIncompleteMultipartUploads",
            "Status": "Enabled",
            "AbortIncompleteMultipartUpload": {
                "DaysAfterInitiation": 1
            }
        }
    ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \
    --bucket "$BUCKET_NAME" \
    --lifecycle-configuration file:///tmp/lifecycle-policy.json

# Set up bucket policy for public read access to images
echo "🔓 Setting up bucket policy for public read access..."
cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy file:///tmp/bucket-policy.json

# Clean up temporary files
rm -f /tmp/cors-config.json /tmp/lifecycle-policy.json /tmp/bucket-policy.json

echo ""
echo "🎉 S3 Bucket Setup Complete!"
echo "============================"
echo "📦 Bucket Name: $BUCKET_NAME"
echo "🌍 Region: $AWS_REGION"
echo "🔗 URL: https://$BUCKET_NAME.s3.$AWS_REGION.amazonaws.com/"
echo ""
echo "📋 Environment Variables to Add:"
echo "AWS_REGION=$AWS_REGION"
echo "AWS_S3_BUCKET_NAME=$BUCKET_NAME"
echo ""
echo "💡 Next Steps:"
echo "1. Add the environment variables to your .env file"
echo "2. Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
echo "3. Update GitHub Actions secrets"
echo "4. Deploy your application"
echo ""
echo "🧪 Test bucket access:"
echo "aws s3 ls s3://$BUCKET_NAME"
