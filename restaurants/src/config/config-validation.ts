export const configValidation = (config: Record<string, any>) => {
  const missingKeys = [
    'NATS_URL',
    'NATS_CLIENT_ID',
    'NATS_CLUSTER_ID',
    'JWT_KEY',
    'REDIS_HOST',
    'MONGO_URI',
    'MONGO_CONNECTION',
    'AWS_S3_ACCESS_KEY_ID',
    'AWS_S3_SECRET_ACCESS_KEY',
    'AWS_S3_REGION',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NO',
  ].filter((key) => !config[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required configuration keys: ${missingKeys.join(', ')}`,
    );
  }

  return null;
};