import { EnvironmentConfig, devConfig, stagingConfig, prodConfig } from '../../configs/environment.config';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables from .env file
 */
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Available environments
 */
export enum Environment {
  DEV = 'dev',
  STAGING = 'staging',
  PROD = 'prod'
}

/**
 * Configuration manager class
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private currentConfig: EnvironmentConfig;

  private constructor() {
    const env = this.getEnvironment();
    this.currentConfig = this.loadConfig(env);
  }

  /**
   * Get singleton instance of ConfigManager
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Get current environment from ENV variable or default to dev
   */
  private getEnvironment(): Environment {
    const env = process.env.ENV || process.env.NODE_ENV || Environment.DEV;
    
    switch (env.toLowerCase()) {
      case 'development':
      case 'dev':
        return Environment.DEV;
      case 'staging':
      case 'stage':
        return Environment.STAGING;
      case 'production':
      case 'prod':
        return Environment.PROD;
      default:
        console.warn(`Unknown environment: ${env}. Defaulting to development.`);
        return Environment.DEV;
    }
  }

  /**
   * Load configuration based on environment
   */
  private loadConfig(env: Environment): EnvironmentConfig {
    switch (env) {
      case Environment.DEV:
        return devConfig;
      case Environment.STAGING:
        return stagingConfig;
      case Environment.PROD:
        return prodConfig;
      default:
        throw new Error(`Configuration not found for environment: ${env}`);
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): EnvironmentConfig {
    return this.currentConfig;
  }

  /**
   * Get specific configuration value
   */
  public get<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
    return this.currentConfig[key];
  }

  /**
   * Check if running in CI environment
   */
  public isCi(): boolean {
    return !!process.env.CI;
  }

  /**
   * Check if running in debug mode
   */
  public isDebug(): boolean {
    return !!process.env.DEBUG;
  }

  /**
   * Get environment name
   */
  public getEnvironmentName(): string {
    return this.currentConfig.name;
  }

  /**
   * Override configuration for testing purposes
   */
  public setConfig(config: Partial<EnvironmentConfig>): void {
    this.currentConfig = { ...this.currentConfig, ...config };
  }
}

/**
 * Export singleton instance
 */
export const configManager = ConfigManager.getInstance();