# Timestamped Test Reports System

This framework automatically generates timestamped HTML and Allure reports for every test run, providing comprehensive test reporting with historical tracking.

## 📊 Report Types Generated

### Every test run automatically creates:

1. **HTML Report** - Playwright's built-in HTML report
   - Location: `test-results/html/{timestamp}_{branch}/`
   - Contains: Test results, screenshots, videos, traces

2. **Allure Results** - Raw data for Allure reporting
   - Location: `test-results/allure-results/{timestamp}_{branch}/`
   - Contains: Test execution data, attachments, history

3. **JSON Report** - Machine-readable test results
   - Location: `test-results/output/{timestamp}_{branch}/results.json`
   - Contains: Detailed test execution data

4. **JUnit Report** - XML format for CI/CD integration
   - Location: `test-results/output/{timestamp}_{branch}/junit.xml`
   - Contains: Test results in JUnit XML format

5. **Summary Report** - Quick overview
   - Location: `test-results/latest-summary.json`
   - Contains: Run statistics, duration, report paths

## 🕒 Timestamp Format

Reports are organized with timestamps in ISO format:
```
Format: YYYY-MM-DDTHH-MM-SS_branch
Example: 2025-09-25T12-34-56_local
```

## 🔗 Symlinks for Latest Reports

The system automatically creates symlinks for easy access to the latest reports:
- `test-results/html/latest` → Latest HTML report
- `test-results/allure-results/latest` → Latest Allure results

## 📋 Custom Reporter Features

### Console Output
The custom reporter provides detailed console output:
```
🚀 Starting Playwright Test Run
📊 Tests to run: 15
🕒 Run ID: 2025-09-25T12-34-56_local
📁 HTML Report: test-results/html/2025-09-25T12-34-56_local
📁 Allure Results: test-results/allure-results/2025-09-25T12-34-56_local

📋 Test Run Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Passed: 14
❌ Failed: 1
⏱️  Duration: 2m 34s
🆔 Run ID: 2025-09-25T12-34-56_local

📊 Report Generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 HTML Report: test-results/html/2025-09-25T12-34-56_local/index.html
📄 Latest HTML: test-results/html/latest/index.html
🎯 Allure Results: test-results/allure-results/2025-09-25T12-34-56_local
🎯 Latest Allure: test-results/allure-results/latest

🔗 Quick Commands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
View HTML Report:  npx playwright show-report "test-results/html/2025-09-25T12-34-56_local"
View Latest HTML:  npx playwright show-report "test-results/html/latest"
Generate Allure:   allure serve "test-results/allure-results/2025-09-25T12-34-56_local"
Latest Allure:     allure serve "test-results/allure-results/latest"
```

## 🚀 Quick Usage

### Run Tests (automatically generates timestamped reports)
```bash
npm test                    # Run all tests
npm run test:headed         # Run with browser UI
npm run test:env:staging    # Run against staging environment
```

### View Reports
```bash
# HTML Reports
npm run report:html                 # Latest HTML report
npm run report:html:timestamp       # Latest timestamped HTML report

# Allure Reports  
npm run report:allure               # Latest Allure report
npm run report:allure:timestamp     # Latest timestamped Allure report
npm run report:allure:generate      # Generate static Allure report

# Other
npm run report:summary              # Show test run summary
npm run report:list                 # List all available reports
```

### Using Report Manager Script
```bash
./report-manager.sh html            # Open latest HTML report
./report-manager.sh allure          # Serve latest Allure report
./report-manager.sh summary         # Show test summary
./report-manager.sh list            # List all reports
./report-manager.sh clean           # Clean all reports
./report-manager.sh clean-old       # Clean reports > 7 days old
```

## 📁 Directory Structure

```
test-results/
├── html/
│   ├── latest -> 2025-09-25T12-34-56_local/    # Symlink to latest
│   ├── 2025-09-25T12-34-56_local/              # Timestamped HTML report
│   ├── 2025-09-25T11-22-33_local/              # Previous run
│   └── summary.json                             # Run summary
├── allure-results/
│   ├── latest -> 2025-09-25T12-34-56_local/    # Symlink to latest
│   ├── 2025-09-25T12-34-56_local/              # Timestamped Allure results
│   └── 2025-09-25T11-22-33_local/              # Previous run
├── allure-report/
│   └── latest/                                  # Generated static Allure report
├── output/
│   ├── 2025-09-25T12-34-56_local/
│   │   ├── junit.xml                           # JUnit XML report
│   │   └── results.json                        # JSON report
│   └── 2025-09-25T11-22-33_local/
└── latest-summary.json                          # Latest run summary
```

## 🛠️ Configuration

### Playwright Config
The timestamped reporting is configured in `playwright.config.ts`:

```typescript
// Generate timestamp for every test run
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const testRunId = `${timestamp}_${branch}`;

// Always use timestamped directories
const htmlReportDir = `test-results/html/${testRunId}`;
const allureResultsDir = `test-results/allure-results/${testRunId}`;
```

### Custom Reporter
The custom reporter (`src/utils/custom-reporter.ts`) handles:
- Console output formatting
- Symlink creation
- Summary file generation
- Report path management

## 📋 Summary File Format

The `latest-summary.json` file contains:
```json
{
  "testRunId": "2025-09-25T12-34-56_local",
  "timestamp": "2025-09-25T12:34:56.789Z",
  "status": "passed",
  "duration": 154000,
  "durationFormatted": "2m 34s",
  "stats": {
    "total": 15,
    "passed": 14,
    "failed": 1,
    "skipped": 0
  },
  "reports": {
    "html": "test-results/html/2025-09-25T12-34-56_local",
    "allure": "test-results/allure-results/2025-09-25T12-34-56_local",
    "latestHtml": "test-results/html/latest",
    "latestAllure": "test-results/allure-results/latest"
  }
}
```

## 🧹 Report Management

### Automatic Cleanup
```bash
npm run report:clean-old    # Remove reports older than 7 days
```

### Manual Cleanup
```bash
npm run report:clean        # Remove all reports (with confirmation)
./report-manager.sh clean   # Interactive cleanup
```

### List Reports
```bash
npm run report:list         # List all available reports
./report-manager.sh list    # Detailed report listing
```

## 🔄 CI/CD Integration

### Environment Detection
The system automatically detects CI environments and adjusts:
- Branch names from `GITHUB_REF_NAME` or defaults to 'local'
- Different report configurations for CI vs local development

### GitHub Actions Example
```yaml
- name: Run Playwright Tests
  run: npm test

- name: Upload HTML Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report-${{ github.run_id }}
    path: test-results/html/
    retention-days: 30

- name: Upload Allure Results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: allure-results-${{ github.run_id }}
    path: test-results/allure-results/
    retention-days: 30
```

## 🎯 Allure Integration

### Install Allure (if not already installed)
```bash
npm install -g allure-commandline
```

### Generate and View Allure Reports
```bash
# Serve interactive report
npm run report:allure

# Generate static HTML report
npm run report:allure:generate

# Using specific timestamp
allure serve test-results/allure-results/2025-09-25T12-34-56_local
```

### Allure Features
- Test execution history
- Test case management
- Rich attachments (screenshots, videos, traces)
- Trend analysis
- Environment information
- Categorized failures

## 🏆 Benefits

1. **Historical Tracking** - Keep track of all test runs with timestamps
2. **Easy Access** - Symlinks provide quick access to latest reports  
3. **Multiple Formats** - HTML, Allure, JSON, JUnit for different needs
4. **Automated Workflow** - No manual report generation needed
5. **CI/CD Ready** - Works seamlessly in continuous integration
6. **Rich Reporting** - Screenshots, videos, traces automatically captured
7. **Summary Information** - Quick overview without opening full reports

## 🔍 Troubleshooting

### Missing Symlinks
If symlinks aren't created:
- Check file permissions
- Ensure the reporter has write access to test-results directory

### Allure Not Working
```bash
# Install Allure globally
npm install -g allure-commandline

# Verify installation
allure --version

# Check Java installation (required for Allure)
java --version
```

### Reports Not Generated
1. Check that tests are actually running
2. Verify playwright.config.ts configuration
3. Check console output for reporter errors
4. Ensure test-results directory is writable

### Large Report Directories
Use the cleanup commands to manage disk space:
```bash
npm run report:clean-old    # Remove old reports
./report-manager.sh clean   # Remove all reports
```