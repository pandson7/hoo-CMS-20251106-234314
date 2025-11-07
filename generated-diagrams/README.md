# Customer Information Management System - Architecture Diagrams

This directory contains AWS architecture diagrams for the Customer Information Management System generated based on the technical design specifications.

## Generated Diagrams

### 1. CMS Architecture Overview (`cms_architecture.png`)
- **Purpose**: High-level system architecture showing main components
- **Components**: User → React Frontend → API Gateway → Lambda → DynamoDB
- **Focus**: Overall system flow and AWS service relationships

### 2. Detailed API Flow (`cms_detailed_flow.png`)
- **Purpose**: Detailed view of API endpoints and data flow
- **Components**: Shows specific REST endpoints and database operations
- **Focus**: API structure and Lambda function responsibilities

### 3. Deployment Architecture (`cms_deployment.png`)
- **Purpose**: Infrastructure deployment and development workflow
- **Components**: Development environment, AWS CDK, monitoring services
- **Focus**: How the system is deployed and managed

### 4. Data Model & Security (`cms_data_security.png`)
- **Purpose**: Data structure, validation, and security measures
- **Components**: Customer data model, validation layers, security controls
- **Focus**: Data integrity and security implementation

## Architecture Highlights

### Serverless Design
- AWS Lambda for compute (Node.js 18.x)
- API Gateway for HTTP API management
- DynamoDB for NoSQL data storage
- On-demand scaling and pay-per-use pricing

### Data Model
- Single DynamoDB table with customer records
- Global Secondary Index (GSI) on email for uniqueness
- UUID-based partition keys for optimal distribution

### Security Features
- HTTPS/TLS encryption in transit
- CORS policy for frontend access
- Input validation using Joi schemas
- Server-side encryption for DynamoDB

### Development Workflow
- Local React development server
- AWS CDK for infrastructure as code
- CloudWatch for monitoring and logging
- Serverless architecture for easy deployment

## File Locations
All diagrams are saved as PNG files in this directory:
- `/Users/sadhupri/echo-architect-artifacts/hoo-CMS-20251106-234314/generated-diagrams/`

## Technical Specifications
Based on design document: `/Users/sadhupri/echo-architect-artifacts/hoo-CMS-20251106-234314/specs/design.md`