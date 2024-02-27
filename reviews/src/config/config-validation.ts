export const configValidation = (config: Record<string, any>) => {
  const missingKeys = [
    'NATS_URL',
    'NATS_CLIENT_ID',
    'NATS_CLUSTER_ID',
    'JWT_KEY',
    'MONGO_URI',
    'AWS_S3_ACCESS_KEY_ID',
    'AWS_S3_SECRET_ACCESS_KEY',
    'AWS_S3_REGION',
    'AWS_S3_REVIEWS_BUCKET',
  ].filter((key) => !config[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required configuration keys: ${missingKeys.join(', ')}`,
    );
  }

  return null;
};
