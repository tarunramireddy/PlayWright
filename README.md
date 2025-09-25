# Playwright Automation Framework

A comprehensive, modular, and reusable Playwright automation framework built with TypeScript. This framework provides a solid foundation for end-to-end testing with best practices, proper architecture, and extensive reporting capabilities.

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns with Page Object Model (POM)
- **Multi-Environment Support**: Easy configuration for dev, staging, and production environments
- **TypeScript Support**: Full type safety and better IDE support
- **Custom Fixtures**: Reusable test fixtures for common setup/teardown operations
- **Comprehensive Reporting**: Allure reports, HTML reports, and JUnit XML output
- **CI/CD Ready**: GitHub Actions workflows for automated testing
- **Utility Classes**: Common helpers for waits, logging, locators, and test data generation
- **Flexible Locator Strategies**: Support for CSS, XPath, text-based, role-based, and test-id locators
- **Authentication Management**: Automated login and session management with environment credentials
- **Cross-Browser Testing**: Support for Chrome, Firefox, Safari, and mobile browsers
- **Parallel Execution**: Fast test execution with parallel processing
- **Winston Logging**: Structured logging with step-by-step execution tracking

## 📁 Project Structure

```
├── .github/
│   └── workflows/          # GitHub Actions CI/CD workflows
├── configs/
│   └── environment.config.ts    # Environment-specific configurations
├── src/
│   ├── config/
│   │   └── config.manager.ts    # Configuration management
│   ├── data/              # Test data files
│   ├── fixtures/
│   │   └── base.fixture.ts      # Custom Playwright fixtures
│   ├── pages/             # Page Object Models
│   │   ├── base.page.ts         # Base page class
│   │   ├── login.page.ts        # Login page
│   │   ├── home.page.ts         # Home page
│   │   └── index.ts             # Page exports
│   ├── tests/             # Test files
│   │   ├── auth.setup.ts        # Authentication setup
│   │   ├── login.spec.ts        # Login tests
│   │   ├── home.spec.ts         # Home page tests
│   │   └── smoke.spec.ts        # Smoke tests
│   └── utils/             # Utility classes
│       ├── logger.ts            # Winston logging utility
│       ├── wait.utils.ts        # Wait helpers
│       ├── locator.helper.ts    # Locator strategy helpers
│       ├── data.generator.ts    # Test data generation
│       ├── allure.reporter.ts   # Allure reporting helpers
│       └── index.ts             # Utility exports
├── test-results/          # Test execution results
├── playwright-report/     # HTML test reports
├── allure-results/        # Allure test results
├── logs/                  # Application logs
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── .env.example          # Environment variables template
```

## 🛠️ Installation

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Java (for Allure reports) - Optional but recommended

### Quick Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tarunramireddy/PlayWright.git
   cd PlayWright
   ```

2. **Run the automated setup:**
   ```bash
   # Option 1: Use the setup script (recommended)
   bash setup.sh
   
   # Option 2: Use npm script
   npm install && npm run setup
   ```

3. **Configure your environment:**
   ```bash
   # Edit the .env file with your actual credentials
   nano .env  # or use your preferred editor
   ```

### Manual Setup (Alternative)

If you prefer manual setup:

1. **Clone and install:**
   ```bash
   git clone https://github.com/tarunramireddy/PlayWright.git
   cd PlayWright
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npm run install:browsers
   ```

3. **Create environment file:**
   ```bash
   npm run env:create
   # Then edit .env with your credentials
   ```

### Environment File Setup

The `.env` file is **not included** in the repository for security reasons. You need to:

1. **Create from template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit with your values:**
   ```bash
   # Required for testing
   TEST_USER_EMAIL=your-email@example.com
   TEST_USER_PASSWORD=your-password
   
   # Environment selection
   ENV=dev
   ```

3. **Available environment variables:**
   ```bash
   # Test Configuration
   ENV=dev                          # Environment: dev/staging/prod
   TEST_USER_EMAIL=test@example.com # Test user email
   TEST_USER_PASSWORD=password123   # Test user password
   
   # Environment-specific credentials
   DEV_USERNAME=dev-user@company.com
   DEV_PASSWORD=dev-password
   STAGING_USERNAME=staging-user@company.com
   STAGING_PASSWORD=staging-password
   ```

## 🔧 Configuration

### Environment Configuration

The framework supports multiple environments (dev, staging, prod). Configure them in `configs/environment.config.ts`:

```typescript
export const devConfig: EnvironmentConfig = {
  name: 'development',
  baseUrl: 'http://localhost:3000',
  timeout: 10000,
  retries: 0,
  headless: false,
  // ... other settings
};
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Environment to run tests against
ENV=dev

# Authentication credentials
DEV_USERNAME=user@example.com
DEV_PASSWORD=password123

# Database settings
DEV_DB_HOST=localhost
DEV_DB_PORT=5432
```

## 🏃‍♂️ Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui
```

### Environment-Specific Commands

```bash
# Run tests against development environment
npm run test:env:dev

# Run tests against staging environment
npm run test:env:staging

# Run tests against production environment
npm run test:env:prod
```

### Browser-Specific Commands

```bash
# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Test Filtering

```bash
# Run tests by tag
npx playwright test --grep @smoke
npx playwright test --grep @authentication

# Run specific test file
npx playwright test src/tests/login.spec.ts

# Run tests matching pattern
npx playwright test --grep "should login"
```

## 📊 Reporting

### HTML Report
```bash
# Generate and view HTML report
npm run report:html
```

### Allure Report
```bash
# Generate and serve Allure report
npm run report:allure
```

### Preserve Reports
By default, reports are overwritten each time. To preserve multiple reports with timestamps:

```bash
# Run tests with unique report folders
npm run test:unique
npm run test:unique:headed

# View latest timestamped report
npm run report:html:latest
```

📖 **For detailed report preservation guide**: [PRESERVE_REPORTS.md](docs/PRESERVE_REPORTS.md)

### Reports Location

- HTML Report: `test-results/html/index.html`
- Allure Report: `test-results/allure/`
- JUnit XML: `test-results/output/junit.xml`
- JSON Results: `test-results/output/results.json`

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@fixtures/index';
import { AllureReporter } from '@utils/index';

test.describe('Feature Tests', () => {
  test('should perform action', async ({ loginPage, testUser }) => {
    // Allure reporting
    AllureReporter.feature('Authentication');
    AllureReporter.story('User Login');
    AllureReporter.severity('critical');
    
    // Test steps
    await AllureReporter.step('Navigate to login', async () => {
      await loginPage.navigate();
      expect(await loginPage.isLoaded()).toBe(true);
    });
    
    await AllureReporter.step('Login with credentials', async () => {
      await loginPage.login(testUser.email, testUser.password);
    });
  });
});
```

### Using Page Objects

```typescript
test('should interact with page elements', async ({ homePage }) => {
  await homePage.navigate();
  await homePage.search('test query');
  await homePage.verifySearchResults();
});
```

### Custom Fixtures Usage

```typescript
test('should use authenticated context', async ({ 
  authenticatedPage, 
  testUser,
  dataGenerator 
}) => {
  // Page already authenticated
  const searchTerm = dataGenerator.generateText(3);
  await authenticatedPage.fill('#search', searchTerm);
});
```

## 🧰 Utility Classes

### Logger
```typescript
import { logger } from '@utils/logger';

logger.info('Test information');
logger.error('Error message', error);
logger.step('Test step description');
```

### Wait Utils
```typescript
import { WaitUtils } from '@utils/wait.utils';

const waitUtils = new WaitUtils(page);
await waitUtils.waitForVisible('#element');
await waitUtils.waitForText('Expected text');
```

### Data Generator
### Data Generator

```typescript
import { DataGenerator } from '@utils/data.generator';

const user = DataGenerator.generateUser();
const email = DataGenerator.generateEmail();
const testId = DataGenerator.generateTestId('user');
```

### Locator Helpers

```typescript
import { LocatorHelper } from '@utils/locator.helper';

// Different locator strategies
await LocatorHelper.css(page, '#email').fill('test@example.com');
await LocatorHelper.xpath(page, '//button[text()="Login"]').click();
await LocatorHelper.text(page, 'Welcome to Dashboard').waitFor();
await LocatorHelper.testId(page, 'submit-btn').click();
await LocatorHelper.role(page, 'button', { name: 'Save' }).click();
await LocatorHelper.placeholder(page, 'Enter your password').fill('pass123');
await LocatorHelper.label(page, 'Email Address').fill('user@test.com');
```

## 🔐 Authentication

The framework provides automated authentication management:

### Setup Authentication
Authentication is handled in `src/tests/auth.setup.ts` and automatically applied to tests that depend on it.

### Using Authenticated Context
```typescript
test('authenticated test', async ({ authenticatedPage }) => {
  // Page is already authenticated
  await authenticatedPage.goto('/dashboard');
});
```

## 🚀 CI/CD Integration

### GitHub Actions

The framework includes two GitHub Actions workflows:

1. **Main Workflow** (`.github/workflows/playwright.yml`):
   - Runs on push/PR to main branches
   - Executes tests across multiple browsers and environments
   - Generates reports and uploads artifacts

2. **Cross-Browser Workflow** (`.github/workflows/cross-browser.yml`):
   - Scheduled weekly execution
   - Tests across different viewport sizes
   - Comprehensive browser compatibility testing

### Setup CI/CD

1. **Enable GitHub Actions** in your repository
2. **Add secrets** for notifications (optional):
   - `SLACK_WEBHOOK`: For Slack notifications
   - `MAIL_USERNAME` & `MAIL_PASSWORD`: For email notifications
3. **Configure environments** in GitHub repository settings
4. **Enable GitHub Pages** for Allure report hosting

## 📋 Best Practices

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Add appropriate Allure annotations
- Use tags for test categorization

### Page Objects
- Keep page objects focused on single pages
- Use descriptive locator names
- Implement verification methods
- Extend base page for common functionality

### Test Data
- Use data generators for dynamic data
- Store static data in separate files
- Parameterize tests with different data sets
- Clean up test data when necessary

### Error Handling
- Add proper error messages
- Take screenshots on failures
- Log important test steps
- Use appropriate wait strategies

## 🐛 Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install --with-deps
   ```

2. **TypeScript Errors**
   ```bash
   npm run build
   npx tsc --noEmit
   ```

3. **Test Timeouts**
   - Increase timeout in configuration
   - Check network conditions
   - Verify selectors are correct

4. **Authentication Issues**
   - Check credentials in environment config
   - Verify auth setup test passes
   - Clear browser storage state

### Debug Mode
```bash
# Run single test in debug mode
npx playwright test --debug src/tests/login.spec.ts

# Run with headed browser
npx playwright test --headed

# Enable verbose logging
DEBUG=pw:* npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Contact the QA team
- Check the documentation wiki

---

**Happy Testing! 🧪✨**