#!/bin/bash

# Setup S3 Environment Variables
# ==============================
# This script helps you set up the required environment variables for S3 image uploads

echo "🔧 S3 Environment Variables Setup"
echo "================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from env.example..."
    cp env.example .env
fi

echo "📋 Required S3 Environment Variables:"
echo ""
echo "# AWS S3 Configuration for Image Uploads"
echo "AWS_REGION=us-east-1"
echo "AWS_S3_BUCKET_NAME=only-he-images"
echo "AWS_ACCESS_KEY_ID=your-access-key-id"
echo "AWS_SECRET_ACCESS_KEY=your-secret-access-key"
echo ""

echo "💡 Instructions:"
echo "1. Create an S3 bucket named 'only-he-images' in us-east-1"
echo "2. Create an IAM user with S3 permissions"
echo "3. Add the above variables to your .env file"
echo "4. Update your GitHub Actions secrets with these values"
echo ""

echo "🚀 To create the S3 bucket automatically:"
echo "aws s3 mb s3://only-he-images --region us-east-1"
echo ""

echo "🔐 Required IAM Policy for the user:"
cat << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::only-he-images/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::only-he-images"
        }
    ]
}
EOF

echo ""
echo "📚 Next Steps:"
echo "1. Run this script to create S3 bucket: ./scripts/create-s3-bucket.sh"
echo "2. Update your environment variables"
echo "3. Deploy your application"
echo "4. Test image upload endpoints"
