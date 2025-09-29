#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 GitHub Secrets Generator${NC}"
echo "============================"
echo
echo -e "${YELLOW}This script generates secure passwords for your deployment${NC}"
echo

# Generate secure passwords
DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
JWT_SECRET=$(openssl rand -base64 32)

echo -e "${GREEN}📋 GitHub Secrets Configuration${NC}"
echo "================================"
echo
echo -e "${BLUE}Go to your GitHub repository:${NC}"
echo "Settings → Secrets and variables → Actions → New repository secret"
echo
echo -e "${GREEN}Required Secrets:${NC}"
echo "----------------"
echo "AWS_ACCESS_KEY_ID = [Your AWS Access Key ID]"
echo "AWS_SECRET_ACCESS_KEY = [Your AWS Secret Access Key]"
echo
echo -e "${YELLOW}Generated Secure Passwords:${NC}"
echo "DATABASE_PASSWORD = $DB_PASSWORD"
echo "JWT_SECRET = $JWT_SECRET"
echo
echo -e "${BLUE}Optional Secrets (for custom configuration):${NC}"
echo "CORS_ORIGIN = * (or your domain)"
echo "LOG_LEVEL = info"
echo
echo -e "${GREEN}📝 Deployment Steps:${NC}"
echo "==================="
echo "1. Add the above secrets to your GitHub repository"
echo "2. Replace [Your AWS Access Key ID] and [Your AWS Secret Access Key] with your actual AWS credentials"
echo "3. Push your code to the main/master branch:"
echo "   git add ."
echo "   git commit -m 'Deploy to AWS App Runner'"
echo "   git push origin main"
echo
echo "4. GitHub Actions will automatically:"
echo "   ✅ Create ECR repository"
echo "   ✅ Build and push Docker image"
echo "   ✅ Create RDS PostgreSQL database (if needed)"
echo "   ✅ Create/update App Runner service"
echo "   ✅ Configure environment variables"
echo
echo -e "${BLUE}📊 What gets created:${NC}"
echo "====================="
echo "• ECR Repository: only-he-api"
echo "• RDS PostgreSQL: only-he-api-postgres (db.t3.micro, 20GB)"
echo "• App Runner Service: only-he-api-production (0.25 vCPU, 0.5GB)"
echo "• Automatic SSL certificate and custom domain"
echo
echo -e "${YELLOW}💰 Estimated Monthly Costs:${NC}"
echo "============================"
echo "• App Runner: ~\$25-50"
echo "• RDS t3.micro: ~\$15-20 (Free tier eligible)"
echo "• Data Transfer: ~\$5-10"
echo "• ECR Storage: ~\$1-2"
echo "• Total: ~\$46-82/month"
echo
echo -e "${GREEN}🔐 After Deployment:${NC}"
echo "===================="
echo "Your API will be available at:"
echo "• API: https://[random-id].us-east-1.awsapprunner.com/api/v1"
echo "• Swagger: https://[random-id].us-east-1.awsapprunner.com/api/docs"
echo
echo "Admin credentials:"
echo "• Email: admin@only-he.com"
echo "• Password: Admin123!"
echo
echo -e "${GREEN}✅ Ready to deploy!${NC}"
echo "Add the secrets to GitHub (with your actual AWS credentials) and push your code to trigger deployment."
