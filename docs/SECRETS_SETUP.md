# GitHub Secrets Setup Guide

This guide explains how to set up GitHub repository secrets for secure handling of login credentials and other sensitive information in your Playwright automation framework.

## 🔐 Required Secrets

### 1. Test User Credentials
These are the primary test user credentials used across all environments:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `TEST_USER_EMAIL` | Primary test user email | `test.user@example.com` |
| `TEST_USER_PASSWORD` | Primary test user password | `SecurePassword123!` |

### 2. Environment-Specific Credentials

#### Development Environment
| Secret Name | Description |
|-------------|-------------|
| `DEV_USERNAME` | Development environment username |
| `DEV_PASSWORD` | Development environment password |
| `DEV_API_KEY` | Development API key (if needed) |

#### Staging Environment
| Secret Name | Description |
|-------------|-------------|
| `STAGING_USERNAME` | Staging environment username |
| `STAGING_PASSWORD` | Staging environment password |
| `STAGING_API_KEY` | Staging API key (if needed) |

#### Production Environment
| Secret Name | Description |
|-------------|-------------|
| `PROD_USERNAME` | Production environment username |
| `PROD_PASSWORD` | Production environment password |
| `PROD_API_KEY` | Production API key (if needed) |

### 3. Notification Secrets (Optional)
| Secret Name | Description |
|-------------|-------------|
| `SLACK_WEBHOOK` | Slack webhook URL for test notifications |
| `MAIL_USERNAME` | SMTP username for email notifications |
| `MAIL_PASSWORD` | SMTP password for email notifications |

## 🛠️ How to Set Up GitHub Secrets

### Step 1: Navigate to Repository Settings
1. Go to your GitHub repository: `https://github.com/tarunramireddy/PlayWright`
2. Click on the **"Settings"** tab
3. In the left sidebar, click **"Secrets and variables"**
4. Click **"Actions"**

### Step 2: Add Repository Secrets
Click **"New repository secret"** for each secret you need to add:

#### Essential Secrets (Add these first):
```bash
# Test User Credentials
TEST_USER_EMAIL = your-test-email@example.com
TEST_USER_PASSWORD = YourSecurePassword123!

# Development Environment
DEV_USERNAME = dev-user@company.com
DEV_PASSWORD = DevPassword123!

# Staging Environment  
STAGING_USERNAME = staging-user@company.com
STAGING_PASSWORD = StagingPassword123!

# Production Environment (use actual production credentials)
PROD_USERNAME = prod-user@company.com
PROD_PASSWORD = ProdPassword123!
```

#### Optional Notification Secrets:
```bash
# Slack Notifications
SLACK_WEBHOOK = https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Email Notifications
MAIL_USERNAME = notifications@company.com
MAIL_PASSWORD = EmailPassword123!
```

### Step 3: Verify Secrets
After adding secrets, you should see them listed in the "Repository secrets" section. The values will be hidden for security.

## 🔧 Local Development

For local development, create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# Edit with your local values
TEST_USER_EMAIL=your-local-test@example.com
TEST_USER_PASSWORD=LocalPassword123!
```

**⚠️ Important:** Never commit the `.env` file to version control. It's already included in `.gitignore`.

## 🚀 How Secrets Are Used in CI/CD

### GitHub Actions Workflow
The secrets are automatically injected into the CI environment:

```yaml
- name: Create environment file
  run: |
    echo "TEST_USER_EMAIL=${{ secrets.TEST_USER_EMAIL }}" >> .env
    echo "TEST_USER_PASSWORD=${{ secrets.TEST_USER_PASSWORD }}" >> .env
    echo "DEV_USERNAME=${{ secrets.DEV_USERNAME }}" >> .env
    echo "DEV_PASSWORD=${{ secrets.DEV_PASSWORD }}" >> .env
```

### In Test Code
Access secrets through environment variables:

```typescript
// In your fixture or test
const testUser = {
  email: process.env.TEST_USER_EMAIL || 'fallback@example.com',
  password: process.env.TEST_USER_PASSWORD || 'fallback-password'
};
```

## 🔍 Environment-Specific Configuration

Your `config.manager.ts` already handles environment-specific configurations:

```typescript
// configs/environment.config.ts
export const devConfig: EnvironmentConfig = {
  // ... other config
  credentials: {
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSWORD,
  }
};
```

## 📋 Security Best Practices

### 1. Use Strong Passwords
- Minimum 12 characters
- Include uppercase, lowercase, numbers, and symbols
- Avoid common words or patterns

### 2. Rotate Credentials Regularly
- Update test credentials monthly
- Change production credentials quarterly
- Use different passwords for each environment

### 3. Limit Secret Access
- Only necessary team members should have access
- Use GitHub teams to manage permissions
- Audit secret usage regularly

### 4. Monitor Secret Usage
- Check Actions logs for secret-related errors
- Set up alerts for failed authentication attempts
- Review access logs periodically

## 🚨 Troubleshooting

### Common Issues:

1. **Secret Not Found Error**
   ```
   Error: Environment variable TEST_USER_EMAIL is not defined
   ```
   **Solution:** Verify the secret name matches exactly in GitHub settings.

2. **Authentication Failures**
   ```
   Error: Invalid credentials
   ```
   **Solution:** Check if credentials are correct and haven't expired.

3. **Permission Denied**
   ```
   Error: Secret access denied
   ```
   **Solution:** Ensure you have admin access to the repository.

### Debugging Steps:

1. **Check Secret Names:** Ensure they match between GitHub and your workflow files
2. **Verify Values:** Test credentials manually in the application
3. **Review Logs:** Check GitHub Actions logs for detailed error messages
4. **Test Locally:** Use the same credentials in your local `.env` file

## 📞 Support

If you encounter issues with secrets setup:

1. **Check GitHub Documentation:** [Encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
2. **Review Logs:** GitHub Actions → Your workflow → Failed job → Logs
3. **Team Support:** Contact your DevOps or QA team lead
4. **Create Issue:** Open a GitHub issue with error details

## ✅ Checklist

Before running tests in CI/CD, ensure:

- [ ] All required secrets are added to GitHub repository
- [ ] Secret names match exactly in workflow files  
- [ ] Test credentials are valid and working
- [ ] Local `.env` file is configured for development
- [ ] Notification secrets are configured (if using notifications)
- [ ] Team members have appropriate access levels

---

**🔒 Remember: Never expose secrets in logs, code, or documentation!**