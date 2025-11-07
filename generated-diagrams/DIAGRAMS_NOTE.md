# Architecture Diagrams Note

## Missing Diagram Files

The following architecture diagrams were generated for this project but are not currently available in this repository due to file size limitations during the GitHub upload process:

1. **cms_architecture.png** - High-level system architecture
2. **cms_detailed_flow.png** - Detailed API flow and endpoints  
3. **cms_deployment.png** - Infrastructure deployment architecture
4. **cms_data_security.png** - Data model and security implementation

## Diagram Descriptions

### CMS Architecture Overview
- Shows the complete serverless architecture
- User → React Frontend → API Gateway → Lambda → DynamoDB flow
- AWS service relationships and data flow

### Detailed API Flow
- REST API endpoints (/customers, /health)
- CRUD operations (GET, POST, PUT, DELETE)
- Lambda function processing logic
- DynamoDB table operations

### Deployment Architecture  
- AWS CDK infrastructure as code
- Development workflow and CI/CD
- CloudWatch monitoring and logging
- Local development setup

### Data Model & Security
- Customer data schema and validation
- DynamoDB table structure with GSI
- Security controls and encryption
- Input validation and error handling

## How to Regenerate

The diagrams can be regenerated using the design specifications in `/specs/design.md` with any AWS architecture diagramming tool such as:
- AWS Architecture Icons
- Lucidchart
- Draw.io
- Visio

All technical details for recreating the diagrams are documented in the project specifications and README files.