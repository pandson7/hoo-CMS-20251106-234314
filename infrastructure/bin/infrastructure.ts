#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HooCMSStack20251106234314 } from '../lib/infrastructure-stack';

const app = new cdk.App();
new HooCMSStack20251106234314(app, 'HooCMSStack20251106234314', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});