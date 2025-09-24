# Quick Start Guide

This guide helps you get the Playwright automation framework up and running quickly after cloning the repository.

## 🚀 One-Command Setup

After cloning the repository, run:

```bash
bash setup.sh
```

This automated script will:
- ✅ Check prerequisites (Node.js, npm)
- ✅ Install all dependencies
- ✅ Install Playwright browsers
- ✅ Create `.env` file from template
- ✅ Set up required directories
- ✅ Check Java installation (for Allure reports)

## 📋 Step-by-Step Process

### 1. Clone Repository
```bash
git clone https://github.com/tarunramireddy/PlayWright.git
cd PlayWright
```

### 2. Choose Setup Method

#### Option A: Automated Setup (Recommended)
```bash
bash setup.sh
```

#### Option B: Manual Setup
```bash
# Install dependencies
npm install

# Install browsers (happens automatically with postinstall)
npm run install:browsers

# Create environment file
npm run env:create
```

### 3. Configure Environment
Edit the `.env` file with your credentials:
```bash
nano .env  # or use your preferred editor
```

Required configuration:
```bash
# Environment selection
ENV=dev

# Test credentials
TEST_USER_EMAIL=your-email@example.com
TEST_USER_PASSWORD=your-password
```

### 4. Verify Setup
```bash
# Run a quick test to verify everything works
npm test -- --grep="should login with valid credentials"
```

## 🔧 Environment File Details

### Why `.env` is Not in Repository
The `.env` file contains sensitive credentials and is excluded from version control for security. Each developer needs to create their own.

### Creating Your `.env` File

1. **Copy from template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit with your values:**
   ```bash
   # Required for basic testing
   ENV=dev
   TEST_USER_EMAIL=your-test-email@example.com
   TEST_USER_PASSWORD=your-test-password
   
   # Optional: Environment-specific credentials
   DEV_USERNAME=dev-user@company.com
   DEV_PASSWORD=dev-password123
   ```

### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ENV` | Yes | Environment to test against | `dev`, `staging`, `prod` |
| `TEST_USER_EMAIL` | Yes | Primary test user email | `test@example.com` |
| `TEST_USER_PASSWORD` | Yes | Primary test user password | `password123` |
| `DEV_USERNAME` | No | Development environment user | `dev-user@company.com` |
| `DEV_PASSWORD` | No | Development environment password | `dev-pass123` |
| `STAGING_USERNAME` | No | Staging environment user | `staging-user@company.com` |
| `STAGING_PASSWORD` | No | Staging environment password | `staging-pass123` |

## 🏃‍♂️ Running Tests

After setup, you can run tests:

```bash
# Run all tests
npm test

# Run with browser UI visible
npm run test:headed

# Run in debug mode
npm run test:debug

# Run against specific environment
npm run test:env:staging
```

## 📊 Generate Reports

```bash
# HTML report
npm run report:html

# Allure report (requires Java)
npm run report:allure
```

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Browser not found errors**
   ```bash
   # Reinstall browsers
   npx playwright install --with-deps
   ```

3. **Environment file missing**
   ```bash
   # Create from template
   cp .env.example .env
   # Then edit with your values
   ```

4. **Permission denied on setup.sh**
   ```bash
   chmod +x setup.sh
   bash setup.sh
   ```

5. **Java not found (for Allure reports)**
   ```bash
   # macOS
   brew install openjdk
   
   # Ubuntu
   sudo apt install openjdk-11-jdk
   
   # Windows - Download from oracle.com
   ```

### Getting Help

- Check `README.md` for detailed documentation
- Review `docs/SECRETS_SETUP.md` for CI/CD configuration
- Look at example test files in `src/tests/`
- Check GitHub Issues for known problems

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Dependencies installed (`node_modules` exists)
- [ ] Browsers installed (`npx playwright --version` works)
- [ ] Environment file created (`.env` exists and configured)
- [ ] Basic test runs (`npm test -- --grep="login"`)
- [ ] Reports generate (`npm run report:html`)

## 🎯 Next Steps

1. **Run your first test:**
   ```bash
   npm run test:headed -- --grep="should login"
   ```

2. **Explore the framework:**
   - Check `src/pages/` for Page Object examples
   - Review `src/tests/` for test examples
   - Look at `src/utils/` for helper functions

3. **Customize for your needs:**
   - Add your application pages to `src/pages/`
   - Write tests in `src/tests/`
   - Update environment configs in `configs/`

4. **Set up CI/CD (optional):**
   - Follow `docs/SECRETS_SETUP.md`
   - Configure GitHub repository secrets
   - Enable GitHub Actions

Happy testing! 🧪✨