export const configValidation = (config: Record<string, any>) => {
  const missingKeys = [
    'NATS_URL',
    'NATS_CLIENT_ID',
    'NATS_CLUSTER_ID',
    'JWT_KEY',
    'EMAIL_JWT_KEY',
    'MONGO_URI',
    'MONGO_CONNECTION',
    'MAIL_USER',
    'MAIL_PASS',
    'MAIL_HOST',
    'MAIL_SERVICE',
    'MAIL_PORT',
    'MAIL_SECURE',
  ].filter((key) => !config[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required configuration keys: ${missingKeys.join(', ')}`,
    );
  }

  return null;
};
