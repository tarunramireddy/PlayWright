# Test Data

This directory contains static test data files used across the test suite.

## Structure

- `users.json` - Test user data
- `products.json` - Product test data
- `test-scenarios.json` - Test scenario configurations

## Usage

```typescript
import { testUsers } from '@data/users.json';
import { testProducts } from '@data/products.json';

test('should use test data', async ({ loginPage }) => {
  const user = testUsers.validUser;
  await loginPage.login(user.email, user.password);
});
```

## Guidelines

1. Keep test data environment-agnostic
2. Use descriptive names for data sets
3. Include both valid and invalid test cases
4. Document data structure and purpose
5. Avoid hardcoding sensitive information
