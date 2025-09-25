import { EnvironmentConfig } from "../../configs/environment.config";
import fs from "fs";
import path from "path";

export interface Credentials {
  username: string;
  password: string;
}

export interface TestUser {
  username: string;
  password: string;
  description?: string;
}

export interface EnvironmentData {
  description: string;
  baseUrl: string;
  credentials: Credentials;
}

export interface CredentialsFile {
  version: string;
  description: string;
  environments: {
    dev: EnvironmentData;
    staging: EnvironmentData;
    prod: EnvironmentData;
  };
  testUsers: {
    superAdmin: TestUser;
    allianceAdmin: TestUser;
    leaAdmin: TestUser;
  };
}

export enum Environment {
  DEV = "dev",
  STAGING = "staging",
  PROD = "prod",
}

export class CredentialsManager {
  private static instance: CredentialsManager;
  private credentials: CredentialsFile;
  private currentEnvironment: Environment;

  private constructor() {
    this.currentEnvironment = this.getEnvironment();
    this.credentials = this.loadCredentials();
  }

  public static getInstance(): CredentialsManager {
    if (!CredentialsManager.instance) {
      CredentialsManager.instance = new CredentialsManager();
    }
    return CredentialsManager.instance;
  }

  private getEnvironment(): Environment {
    const env = process.env.ENV || process.env.NODE_ENV || Environment.DEV;

    switch (env.toLowerCase()) {
      case "development":
      case "dev":
        return Environment.DEV;
      case "staging":
      case "stage":
        return Environment.STAGING;
      case "production":
      case "prod":
        return Environment.PROD;
      default:
        console.warn(`Unknown environment: ${env}. Defaulting to development.`);
        return Environment.DEV;
    }
  }

  private loadCredentials(): CredentialsFile {
    const credentialsPath = path.resolve(__dirname, "../../credentials.json");

    if (!fs.existsSync(credentialsPath)) {
      throw new Error(
        `Credentials file not found: ${credentialsPath}\n` +
          `Please copy credentials.example.json to credentials.json and update with your credentials.`
      );
    }

    try {
      const credentialsContent = fs.readFileSync(credentialsPath, "utf-8");
      return JSON.parse(credentialsContent);
    } catch (error) {
      throw new Error(
        `Failed to load credentials file: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public getEnvironmentConfig(): EnvironmentData {
    return this.credentials.environments[this.currentEnvironment];
  }

  public getCredentials(): Credentials {
    return this.getEnvironmentConfig().credentials;
  }

  public getTestUser(
    userType: keyof CredentialsFile["testUsers"] = "superAdmin"
  ): TestUser {
    return this.credentials.testUsers[userType];
  }

  public getAllTestUsers(): CredentialsFile["testUsers"] {
    return this.credentials.testUsers;
  }

  public getEnvironmentName(): string {
    return this.currentEnvironment;
  }

  public isCi(): boolean {
    return !!process.env.CI;
  }

  public isDebug(): boolean {
    return !!process.env.DEBUG;
  }

  public getPlaywrightConfig(): EnvironmentConfig {
    const envConfig = this.getEnvironmentConfig();

    const config: EnvironmentConfig = {
      name: this.currentEnvironment,
      baseUrl: envConfig.baseUrl,
      timeout: 30000,
      retries: this.isCi() ? 2 : 0,
      headless: !this.isDebug() && this.isCi(),
      video: this.isCi() ? "retain-on-failure" : "on",
      screenshot: "only-on-failure",
      trace: "retain-on-failure",
      credentials: envConfig.credentials,
    };

    switch (this.currentEnvironment) {
      case Environment.DEV:
        config.timeout = 10000;
        config.retries = 0;
        config.headless = false;
        config.slowMo = 100;
        config.video = "on";
        config.screenshot = "on";
        config.trace = "on";
        break;

      case Environment.STAGING:
        config.timeout = 20000;
        config.retries = 1;
        config.workers = 2;
        break;

      case Environment.PROD:
        config.timeout = 30000;
        config.retries = 2;
        config.workers = 4;
        config.video = "off";
        break;
    }

    return config;
  }
}

export const credentialsManager = CredentialsManager.getInstance();