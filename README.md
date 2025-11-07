# Customer Information Management System (CMS)

A full-stack web application for managing customer information with CRUD operations, built using AWS serverless architecture and React.

## Architecture

### Backend (AWS Serverless)
- **AWS Lambda**: Node.js 20.x runtime with Express.js and serverless-express
- **Amazon DynamoDB**: NoSQL database with provisioned billing mode and auto-scaling
- **API Gateway**: HTTP API with CORS enabled for frontend integration
- **AWS CDK**: Infrastructure as Code for deployment

### Frontend
- **React**: Modern functional components with hooks
- **Axios**: HTTP client for API communication
- **Custom CSS**: Responsive design without external UI frameworks

## Features

### Customer Management
- ✅ Create new customers with validation
- ✅ View all customers in a responsive table
- ✅ Search customers by name or email
- ✅ Update existing customer information
- ✅ Delete customers with confirmation
- ✅ Email uniqueness validation
- ✅ Form validation with error handling

### Data Validation
- Required fields: Name and Email
- Email format validation
- Phone number (optional, max 20 characters)
- Address (optional, max 500 characters)
- Name (max 100 characters)

## Project Structure

```
hoo-CMS-20251106-234314/
├── infrastructure/          # AWS CDK infrastructure code
│   ├── lib/
│   │   └── infrastructure-stack.ts
│   ├── bin/
│   │   └── infrastructure.ts
│   └── package.json
├── backend/                # Lambda function code
│   ├── index.js            # Main Lambda handler
│   ├── package.json
│   └── test.js            # Local testing
├── frontend/              # React application
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   └── App.css        # Styling
│   └── package.json
├── specs/                 # Project specifications
├── tasks/                 # Task definitions
└── README.md
```

## Deployment

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- AWS CDK CLI installed

### Backend Deployment
```bash
cd infrastructure
npm install
npm run build
npx cdk deploy --require-approval never
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Base URL
```
https://6d0c6widn7.execute-api.us-east-1.amazonaws.com/api
```

### Endpoints

#### Health Check
- **GET** `/health`
- Returns: `{"status": "OK", "timestamp": "..."}`

#### Customers
- **GET** `/customers` - Get all customers
- **GET** `/customers?search=term` - Search customers
- **GET** `/customers/{id}` - Get specific customer
- **POST** `/customers` - Create new customer
- **PUT** `/customers/{id}` - Update customer
- **DELETE** `/customers/{id}` - Delete customer

### Customer Schema
```json
{
  "customer_id": "uuid-v4-string",
  "name": "string (required, max 100 chars)",
  "email": "string (required, valid email, unique)",
  "phone": "string (optional, max 20 chars)",
  "address": "string (optional, max 500 chars)",
  "registration_date": "ISO 8601 timestamp",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

## AWS Resources Created

### DynamoDB
- **Table**: `customers-table-20251106234314`
- **Partition Key**: `customer_id` (String)
- **GSI**: `email-index` for uniqueness validation
- **Billing**: Provisioned with auto-scaling (5 RCU/WCU)

### Lambda
- **Function**: `customer-management-api-20251106234314`
- **Runtime**: Node.js 20.x
- **Memory**: 256 MB
- **Timeout**: 30 seconds

### API Gateway
- **API**: `customer-management-api-20251106234314`
- **Type**: HTTP API v2
- **CORS**: Enabled for localhost:3000

## Testing

### Backend API Testing
All CRUD operations have been tested:

```bash
# Health check
curl -X GET "https://6d0c6widn7.execute-api.us-east-1.amazonaws.com/api/health"

# Get customers
curl -X GET "https://6d0c6widn7.execute-api.us-east-1.amazonaws.com/api/customers"

# Create customer
curl -X POST "https://6d0c6widn7.execute-api.us-east-1.amazonaws.com/api/customers" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "phone": "555-1234", "address": "123 Main St"}'

# Search customers
curl -X GET "https://6d0c6widn7.execute-api.us-east-1.amazonaws.com/api/customers?search=john"

# Update customer
curl -X PUT "https://6d0c6widn7.execute-api.us-east-1.amazonaws.com/api/customers/{id}" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated", "email": "john@example.com", "phone": "555-5678", "address": "456 Oak St"}'

# Delete customer
curl -X DELETE "https://6d0c6widn7.execute-api.us-east-1.amazonaws.com/api/customers/{id}"
```

### Integration Testing
Run the comprehensive integration test:
```bash
node test-frontend.js
```

## Security Features

- Input validation on all endpoints
- Email uniqueness enforcement
- SQL injection prevention (DynamoDB SDK)
- XSS prevention (React built-in)
- CORS configuration for secure frontend access
- Error handling with appropriate HTTP status codes

## Performance

- **Response Times**: < 2 seconds for all operations
- **Scalability**: Serverless auto-scaling
- **Database**: DynamoDB with auto-scaling enabled
- **Caching**: Stateless API design

## Error Handling

### Backend
- Centralized error middleware
- Structured error responses
- Validation error messages
- HTTP status codes (400, 404, 500)

### Frontend
- Loading states for all operations
- User-friendly error messages
- Form validation with real-time feedback
- Confirmation dialogs for destructive actions

## Future Enhancements

- Authentication and authorization
- Pagination for large datasets
- Advanced search filters
- Customer import/export functionality
- Audit logging
- Data backup and recovery

## Support

For issues or questions, refer to the CloudWatch logs:
- Log Group: `/aws/lambda/customer-management-api-20251106234314`
- Monitor API Gateway metrics in AWS Console