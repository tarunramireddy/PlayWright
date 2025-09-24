import { allure } from 'allure-playwright';

/**
 * Allure reporting utilities
 */
export class AllureReporter {
  /**
   * Add description to test
   */
  static description(text: string): void {
    allure.description(text);
  }

  /**
   * Add owner to test
   */
  static owner(name: string): void {
    allure.owner(name);
  }

  /**
   * Add severity to test
   */
  static severity(level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'): void {
    allure.severity(level);
  }

  /**
   * Add story to test
   */
  static story(name: string): void {
    allure.story(name);
  }

  /**
   * Add feature to test
   */
  static feature(name: string): void {
    allure.feature(name);
  }

  /**
   * Add epic to test
   */
  static epic(name: string): void {
    allure.epic(name);
  }

  /**
   * Add tag to test
   */
  static tag(name: string): void {
    allure.tag(name);
  }

  /**
   * Add issue link
   */
  static issue(id: string, name?: string): void {
    allure.issue(id, name || id);
  }

  /**
   * Add test management system link
   */
  static tms(id: string, name?: string): void {
    allure.tms(id, name || id);
  }

  /**
   * Add step to test execution
   */
  static async step<T>(name: string, body: () => T | Promise<T>): Promise<T> {
    const result = await body();
    await allure.step(name, async () => {
      // Step execution for Allure reporting
    });
    return result;
  }

  /**
   * Attach file to test
   */
  static attachment(name: string, content: string | Buffer, type: string): void {
    allure.attachment(name, content, type);
  }

  /**
   * Attach screenshot
   */
  static screenshot(name: string, screenshot: Buffer): void {
    allure.attachment(name, screenshot, 'image/png');
  }

  /**
   * Attach text
   */
  static text(name: string, content: string): void {
    allure.attachment(name, content, 'text/plain');
  }

  /**
   * Attach JSON
   */
  static json(name: string, content: object): void {
    allure.attachment(name, JSON.stringify(content, null, 2), 'application/json');
  }

  /**
   * Add parameter to test
   */
  static parameter(name: string, value: string): void {
    allure.parameter(name, value);
  }
}

/**
 * Decorators for test methods
 */
export const TestDecorators = {
  /**
   * Feature decorator
   */
  feature: (featureName: string) => {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        AllureReporter.feature(featureName);
        return originalMethod.apply(this, args);
      };
    };
  },

  /**
   * Story decorator
   */
  story: (storyName: string) => {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        AllureReporter.story(storyName);
        return originalMethod.apply(this, args);
      };
    };
  },

  /**
   * Severity decorator
   */
  severity: (level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial') => {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        AllureReporter.severity(level);
        return originalMethod.apply(this, args);
      };
    };
  }
};