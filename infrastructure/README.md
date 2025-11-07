# Customer Management System Infrastructure

This directory contains the AWS CDK infrastructure code for the Customer Information Management System.

## Architecture

The infrastructure creates a serverless architecture using:

- **AWS Lambda**: Node.js 20.x runtime for the API
- **Amazon DynamoDB**: NoSQL database for customer data
- **API Gateway**: HTTP API for REST endpoints
- **CloudWatch**: Logging and monitoring

## Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Deployment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the TypeScript code:
   ```bash
   npm run build
   ```

3. Deploy the stack:
   ```bash
   npx cdk deploy --require-approval never
   ```

## Stack Resources

### DynamoDB Table
- **Name**: `customers-table-20251106234314`
- **Partition Key**: `customer_id` (String)
- **GSI**: `email-index` for email uniqueness validation
- **Billing**: Provisioned with 5 RCU/WCU and auto-scaling

### Lambda Function
- **Name**: `customer-management-api-20251106234314`
- **Runtime**: Node.js 20.x
- **Memory**: 256 MB
- **Timeout**: 30 seconds
- **Code**: Located in `../backend` directory

### API Gateway
- **Name**: `customer-management-api-20251106234314`
- **Type**: HTTP API (v2)
- **CORS**: Enabled for `http://localhost:3000`
- **Routes**: `/api/{proxy+}` with ANY method

## Useful Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and compile
- `npm run test` - Perform the Jest unit tests
- `npx cdk deploy` - Deploy this stack to your default AWS account/region
- `npx cdk diff` - Compare deployed stack with current state
- `npx cdk synth` - Emit the synthesized CloudFormation template
- `npx cdk destroy` - Delete the stack and all resources

## Environment Variables

The Lambda function receives the following environment variables:
- `DYNAMODB_TABLE_NAME`: Name of the DynamoDB table

## Outputs

After deployment, the stack outputs:
- **ApiEndpoint**: The API Gateway endpoint URL
- **TableName**: The DynamoDB table name

## Security

- DynamoDB encryption at rest (default AWS managed keys)
- HTTPS/TLS encryption in transit
- IAM roles with least privilege access
- CORS policy restricting frontend origins