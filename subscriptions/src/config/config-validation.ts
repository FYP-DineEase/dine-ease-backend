export const configValidation = (config: Record<string, any>) => {
  const missingKeys = [
    'NATS_URL',
    'NATS_CLIENT_ID',
    'NATS_CLUSTER_ID',
    'JWT_KEY',
    'MONGO_URI',
    'STRIPE_SECRET',
  ].filter((key) => !config[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required configuration keys: ${missingKeys.join(', ')}`,
    );
  }

  return config;
};
