import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';

export class HooCMSStack20251106234314 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const customersTable = new dynamodb.Table(this, 'CustomersTable20251106234314', {
      tableName: 'customers-table-20251106234314',
      partitionKey: { name: 'customer_id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // GSI for email uniqueness
    customersTable.addGlobalSecondaryIndex({
      indexName: 'email-index',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });

    // Lambda Function
    const customerApi = new lambda.Function(this, 'CustomerAPI20251106234314', {
      functionName: 'customer-management-api-20251106234314',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../backend'),
      environment: {
        DYNAMODB_TABLE_NAME: customersTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Grant DynamoDB permissions
    customersTable.grantFullAccess(customerApi);

    // API Gateway
    const httpApi = new apigatewayv2.HttpApi(this, 'CustomerHttpAPI20251106234314', {
      apiName: 'customer-management-api-20251106234314',
      corsPreflight: {
        allowOrigins: ['http://localhost:3000'],
        allowMethods: [
          apigatewayv2.CorsHttpMethod.GET,
          apigatewayv2.CorsHttpMethod.POST,
          apigatewayv2.CorsHttpMethod.PUT,
          apigatewayv2.CorsHttpMethod.DELETE,
          apigatewayv2.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Lambda Integration
    const lambdaIntegration = new integrations.HttpLambdaIntegration(
      'CustomerLambdaIntegration',
      customerApi
    );

    // Routes
    httpApi.addRoutes({
      path: '/api/{proxy+}',
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: lambdaIntegration,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: httpApi.apiEndpoint,
      description: 'HTTP API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: customersTable.tableName,
      description: 'DynamoDB table name',
    });
  }
}