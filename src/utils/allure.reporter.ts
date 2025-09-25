import { allure } from "allure-playwright";

export class AllureReporter {
  static description(text: string): void {
    allure.description(text);
  }

  static owner(name: string): void {
    allure.owner(name);
  }

  static severity(
    level: "blocker" | "critical" | "normal" | "minor" | "trivial"
  ): void {
    allure.severity(level);
  }

  static story(name: string): void {
    allure.story(name);
  }

  static feature(name: string): void {
    allure.feature(name);
  }

  static epic(name: string): void {
    allure.epic(name);
  }

  static tag(name: string): void {
    allure.tag(name);
  }

  static issue(id: string, name?: string): void {
    allure.issue(id, name || id);
  }

  static tms(id: string, name?: string): void {
    allure.tms(id, name || id);
  }

  static async step<T>(name: string, body: () => T | Promise<T>): Promise<T> {
    const result = await body();
    await allure.step(name, async () => {});
    return result;
  }

  static attachment(
    name: string,
    content: string | Buffer,
    type: string
  ): void {
    allure.attachment(name, content, type);
  }

  static screenshot(name: string, screenshot: Buffer): void {
    allure.attachment(name, screenshot, "image/png");
  }

  static text(name: string, content: string): void {
    allure.attachment(name, content, "text/plain");
  }

  static json(name: string, content: object): void {
    allure.attachment(
      name,
      JSON.stringify(content, null, 2),
      "application/json"
    );
  }

  static parameter(name: string, value: string): void {
    allure.parameter(name, value);
  }
}

export const TestDecorators = {
  feature: (featureName: string) => {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        AllureReporter.feature(featureName);
        return originalMethod.apply(this, args);
      };
    };
  },

  story: (storyName: string) => {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        AllureReporter.story(storyName);
        return originalMethod.apply(this, args);
      };
    };
  },

  severity: (
    level: "blocker" | "critical" | "normal" | "minor" | "trivial"
  ) => {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]) {
        AllureReporter.severity(level);
        return originalMethod.apply(this, args);
      };
    };
  },
}; 