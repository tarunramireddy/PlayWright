# User Management System

This framework provides flexible user management that allows you to use any specific user from the credentials.json file directly in your page objects or test spec files without hardcoding.

## Features

- ✅ **Dynamic User Selection**: Choose any user type in tests or page objects
- ✅ **Type-Safe**: Full TypeScript support with proper types
- ✅ **Flexible Fixtures**: Multiple ways to work with users
- ✅ **Authenticated Contexts**: Pre-authenticated browser contexts for any user
- ✅ **Easy Integration**: Simple API for page objects and test files

## Available Users

The system supports the following user types from `credentials.json`:
- `superAdmin` - Super admin user
- `allianceAdmin` - Alliance admin user  
- `leaAdmin` - LEA admin user

## Usage Examples

### 1. Direct User Access in Tests

```typescript
import { test, expect } from '../fixtures/index';
import { getUser, userManager } from '../utils/user.manager';

test('should login as superAdmin', async ({ loginPage }) => {
  // Get specific user data
  const superAdmin = getUser('superAdmin');
  
  await loginPage.navigate();
  await loginPage.login(superAdmin.email, superAdmin.password);
  
  expect(await loginPage.getCurrentUrl()).toContain('/home');
});
```

### 2. Using Fixtures with Dynamic User Selection

```typescript
test('should login as allianceAdmin using fixture', async ({ withUser, loginPage }) => {
  const allianceAdmin = withUser('allianceAdmin');
  
  await loginPage.navigate();
  await loginPage.login(allianceAdmin.email, allianceAdmin.password);
});
```

### 3. Authenticated Context for Specific User

```typescript
test('should use authenticated context', async ({ authenticatedContextWith }) => {
  // Create pre-authenticated context for specific user
  const context = await authenticatedContextWith('leaAdmin');
  const page = await context.newPage();
  
  await page.goto('/dashboard');
  // User is already logged in!
  
  await page.close();
  await context.close();
});
```

### 4. Testing with All Users

```typescript
test('should test all user types', async ({ loginPage }) => {
  const allUsers = userManager.getAllUsers();
  
  for (const [userType, userData] of Object.entries(allUsers)) {
    await loginPage.navigate();
    await loginPage.clearForm();
    await loginPage.login(userData.email, userData.password);
    
    // Add user-specific verifications
    userManager.logUserInfo(userType);
  }
});
```

### 5. Random User Testing

```typescript
test('should login with random user', async ({ loginPage }) => {
  const randomUser = userManager.getRandomUser();
  
  await loginPage.navigate();
  await loginPage.login(randomUser.email, randomUser.password);
  
  console.log(`Tested with: ${randomUser.userType}`);
});
```

## Page Object Integration

You can also use the user management system directly in page objects:

```typescript
import { getUser, UserType } from '../utils/user.manager';

export class HomePage extends BasePage {
  /**
   * Verify dashboard based on user type
   */
  async verifyDashboardForUser(userType: UserType): Promise<void> {
    const user = getUser(userType);
    logger.step(`Verifying dashboard for ${userType}: ${user.email}`);
    
    switch (userType) {
      case 'superAdmin':
        await this.verifyElementVisible(this.superadminDashboard);
        break;
      case 'allianceAdmin':
        await this.verifyElementVisible(this.allianceDashboard);
        break;
      case 'leaAdmin':
        await this.verifyElementVisible(this.leaDashboard);
        break;
    }
  }
  
  /**
   * Auto-detect current user type
   */
  async verifyCurrentUserDashboard(): Promise<UserType> {
    // Automatically detects which dashboard is visible
    // and returns the corresponding user type
  }
}
```

## API Reference

### UserManager Class

#### Methods

- `getUser(userType)` - Get specific user data
- `getAllUsers()` - Get all available users  
- `getRandomUser()` - Get a random user
- `getUsersByRole(role)` - Get users by role
- `logUserInfo(userType)` - Log user information
- `isValidUserType(userType)` - Validate user type

#### Direct Functions

- `getUser(userType)` - Convenient direct access
- `getAllUsers()` - Convenient direct access
- `getRandomUser()` - Convenient direct access

### Fixture Interface

```typescript
interface TestFixtures {
  // Get user data function
  withUser: (userType: UserType) => UserData;
  
  // Create authenticated context function  
  authenticatedContextWith: (userType: UserType) => Promise<BrowserContext>;
  
  // Legacy fixtures (still available)
  testUser: { email: string; password: string };
  authenticatedContext: BrowserContext;
}
```

### Types

```typescript
type UserType = 'superAdmin' | 'allianceAdmin' | 'leaAdmin';

interface UserData {
  email: string;
  password: string;
  description?: string;
  userType: UserType;
}
```

## Migration Guide

### From Old System
```typescript
// OLD WAY (hardcoded in fixture)
test('old way', async ({ testUser, loginPage }) => {
  await loginPage.login(testUser.email, testUser.password);
});
```

### To New System
```typescript
// NEW WAY (dynamic user selection)
test('new way', async ({ loginPage }) => {
  const user = getUser('superAdmin'); // or any user type
  await loginPage.login(user.email, user.password);
});

// OR using fixture
test('new way with fixture', async ({ withUser, loginPage }) => {
  const user = withUser('allianceAdmin');
  await loginPage.login(user.email, user.password);
});
```

## Benefits

1. **No Hardcoding**: Users are selected dynamically, not hardcoded in fixtures
2. **Flexible Testing**: Easy to test different user scenarios
3. **Maintainable**: Single source of truth in credentials.json
4. **Type Safe**: Full TypeScript support prevents errors
5. **Backward Compatible**: Old fixtures still work during migration
6. **Easy Integration**: Works seamlessly with existing page objects and tests

## Best Practices

1. **Use Specific Users**: Choose the appropriate user type for your test scenario
2. **Log User Info**: Use `userManager.logUserInfo()` for better test debugging
3. **Clean Credentials**: Keep credentials.json organized and up-to-date
4. **Type Safety**: Always use the `UserType` type for better IDE support
5. **Context Management**: Remember to close authenticated contexts when done