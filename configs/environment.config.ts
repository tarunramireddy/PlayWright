import { credentialsManager } from '../src/config/config.manager';

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
  };
}

export function getEnvironmentConfig(): EnvironmentConfig {
  return credentialsManager.getPlaywrightConfig();
}