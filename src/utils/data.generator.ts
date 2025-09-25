import { faker } from "@faker-js/faker";

export class DataGenerator {
  static generateEmail(domain?: string): string {
    return domain
      ? `${faker.internet.userName()}@${domain}`
      : faker.internet.email();
  }

  static generatePassword(
    length: number = 12,
    memorable: boolean = true
  ): string {
    return faker.internet.password({ length, memorable });
  }
}