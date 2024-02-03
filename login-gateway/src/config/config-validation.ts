export const configValidation = (config: Record<string, any>) => {
  const missingKeys = ['JWT_KEY'].filter((key) => !config[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required configuration keys: ${missingKeys.join(', ')}`,
    );
  }

  return null;
};
