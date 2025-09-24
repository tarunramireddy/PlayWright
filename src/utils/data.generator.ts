import { faker } from '@faker-js/faker';

/**
 * Test data generator utility
 */
export class DataGenerator {
  /**
   * Generate random user data
   */
  static generateUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12, memorable: true }),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country()
      },
      dateOfBirth: faker.date.past({ years: 50, refDate: new Date('2000-01-01') }),
      company: faker.company.name(),
      jobTitle: faker.person.jobTitle()
    };
  }

  /**
   * Generate random string
   */
  static generateString(length: number = 10): string {
    return faker.string.alpha({ length });
  }

  /**
   * Generate random number
   */
  static generateNumber(min: number = 1, max: number = 1000): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate random email
   */
  static generateEmail(domain?: string): string {
    return domain ? 
      `${faker.internet.userName()}@${domain}` : 
      faker.internet.email();
  }

  /**
   * Generate random password
   */
  static generatePassword(length: number = 12, memorable: boolean = true): string {
    return faker.internet.password({ length, memorable });
  }

  /**
   * Generate random date
   */
  static generateDate(from?: Date, to?: Date): Date {
    return faker.date.between({ 
      from: from || new Date('2020-01-01'), 
      to: to || new Date() 
    });
  }

  /**
   * Generate random phone number
   */
  static generatePhoneNumber(): string {
    return faker.phone.number();
  }

  /**
   * Generate random UUID
   */
  static generateUuid(): string {
    return faker.string.uuid();
  }

  /**
   * Generate random product data
   */
  static generateProduct() {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      inStock: faker.datatype.boolean(),
      weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
      dimensions: {
        length: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
        width: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
        height: faker.number.float({ min: 1, max: 100, fractionDigits: 1 })
      }
    };
  }

  /**
   * Generate random credit card data
   */
  static generateCreditCard() {
    return {
      number: faker.finance.creditCardNumber(),
      cvv: faker.finance.creditCardCVV(),
      issuer: faker.finance.creditCardIssuer(),
      expiryMonth: faker.date.future().getMonth() + 1,
      expiryYear: faker.date.future().getFullYear()
    };
  }

  /**
   * Generate random array from given array
   */
  static getRandomFromArray<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }

  /**
   * Generate random boolean
   */
  static generateBoolean(): boolean {
    return faker.datatype.boolean();
  }

  /**
   * Generate random color
   */
  static generateColor(): string {
    return faker.color.human();
  }

  /**
   * Generate random URL
   */
  static generateUrl(): string {
    return faker.internet.url();
  }

  /**
   * Generate unique test identifier
   */
  static generateTestId(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = faker.string.alphanumeric(6).toLowerCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Generate random text with specified word count
   */
  static generateText(wordCount: number = 10): string {
    return faker.lorem.words(wordCount);
  }

  /**
   * Generate random sentence
   */
  static generateSentence(wordCount?: number): string {
    return faker.lorem.sentence(wordCount);
  }

  /**
   * Generate random paragraph
   */
  static generateParagraph(sentenceCount?: number): string {
    return faker.lorem.paragraph(sentenceCount);
  }
}