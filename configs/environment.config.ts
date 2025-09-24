/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiUrl?: string;
  timeout: number;
  retries: number;
  workers?: number;
  headless: boolean;
  slowMo?: number;
  video?: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry';
  screenshot?: 'off' | 'on' | 'only-on-failure';
  trace?: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry';
  credentials?: {
    username?: string;
    password?: string;
    apiKey?: string;
  };
  database?: {
    host?: string;
    port?: number;
    name?: string;
  };
}

/**
 * Default configuration values
 */
const defaultConfig: Partial<EnvironmentConfig> = {
  timeout: 30000,
  retries: 2,
  headless: true,
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure'
};

/**
 * Development environment configuration
 */
export const devConfig: EnvironmentConfig = {
  ...defaultConfig,
  name: 'development',
  baseUrl: 'http://localhost:3000',
  apiUrl: 'http://localhost:3001/api',
  timeout: 10000,
  retries: 0,
  workers: 1,
  headless: false,
  slowMo: 100,
  video: 'on',
  screenshot: 'on',
  trace: 'on',
  credentials: {
    username: 'dev-user@example.com',
    password: 'dev-password',
    apiKey: 'dev-api-key'
  },
  database: {
    host: 'localhost',
    port: 5432,
    name: 'dev_database'
  }
} as EnvironmentConfig;

/**
 * Staging environment configuration
 */
export const stagingConfig: EnvironmentConfig = {
  ...defaultConfig,
  name: 'staging',
  baseUrl: 'https://staging.example.com',
  apiUrl: 'https://staging-api.example.com/api',
  timeout: 20000,
  retries: 1,
  workers: 2,
  headless: true,
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
  credentials: {
    username: process.env.STAGING_USERNAME || 'staging-user@example.com',
    password: process.env.STAGING_PASSWORD || 'staging-password',
    apiKey: process.env.STAGING_API_KEY || 'staging-api-key'
  },
  database: {
    host: process.env.STAGING_DB_HOST || 'staging-db.example.com',
    port: parseInt(process.env.STAGING_DB_PORT || '5432'),
    name: process.env.STAGING_DB_NAME || 'staging_database'
  }
} as EnvironmentConfig;

/**
 * Production environment configuration
 */
export const prodConfig: EnvironmentConfig = {
  ...defaultConfig,
  name: 'production',
  baseUrl: 'https://example.com',
  apiUrl: 'https://api.example.com/api',
  timeout: 30000,
  retries: 2,
  workers: 4,
  headless: true,
  video: 'off',
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
  credentials: {
    username: process.env.PROD_USERNAME || '',
    password: process.env.PROD_PASSWORD || '',
    apiKey: process.env.PROD_API_KEY || ''
  },
  database: {
    host: process.env.PROD_DB_HOST || '',
    port: parseInt(process.env.PROD_DB_PORT || '5432'),
    name: process.env.PROD_DB_NAME || ''
  }
} as EnvironmentConfig;