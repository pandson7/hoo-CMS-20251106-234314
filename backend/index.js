const serverlessExpress = require('@vendia/serverless-express');
const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const app = express();
const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

app.use(cors());
app.use(express.json());

const customerSchema = Joi.object({
  name: Joi.string().required().max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().max(20).allow(''),
  address: Joi.string().max(500).allow('')
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all customers with optional search
app.get('/api/customers', async (req, res) => {
  try {
    const { search, limit = 50 } = req.query;
    
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Limit: parseInt(limit)
    };

    const result = await docClient.send(new ScanCommand(params));
    let customers = result.Items || [];

    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower)
      );
    }

    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer by ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { customer_id: req.params.id }
    };

    const result = await docClient.send(new GetCommand(params));
    
    if (!result.Item) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(result.Item);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create new customer
app.post('/api/customers', async (req, res) => {
  try {
    const { error, value } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check for duplicate email
    const emailCheckParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': value.email }
    };

    const emailCheck = await docClient.send(new QueryCommand(emailCheckParams));
    if (emailCheck.Items && emailCheck.Items.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const customer = {
      customer_id: uuidv4(),
      ...value,
      registration_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: customer
    };

    await docClient.send(new PutCommand(params));
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { error, value } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if customer exists
    const getParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { customer_id: req.params.id }
    };

    const existing = await docClient.send(new GetCommand(getParams));
    if (!existing.Item) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Check for duplicate email (excluding current customer)
    if (value.email !== existing.Item.email) {
      const emailCheckParams = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': value.email }
      };

      const emailCheck = await docClient.send(new QueryCommand(emailCheckParams));
      if (emailCheck.Items && emailCheck.Items.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const updateParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { customer_id: req.params.id },
      UpdateExpression: 'SET #name = :name, email = :email, phone = :phone, address = :address, updated_at = :updated_at',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: {
        ':name': value.name,
        ':email': value.email,
        ':phone': value.phone || '',
        ':address': value.address || '',
        ':updated_at': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(updateParams));
    res.json(result.Attributes);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    // Check if customer exists
    const getParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { customer_id: req.params.id }
    };

    const existing = await docClient.send(new GetCommand(getParams));
    if (!existing.Item) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const deleteParams = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { customer_id: req.params.id }
    };

    await docClient.send(new DeleteCommand(deleteParams));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

exports.handler = serverlessExpress({ app });