# Simple Report Preservation

Instead of overwriting reports each time, preserve them with timestamps.

## 🎯 The Problem

By default, Playwright overwrites the `playwright-report/` folder each time you run tests. This means you lose previous test results.

## ✅ Simple Solution

Use the `ARCHIVE_REPORTS=true` environment variable to create unique report folders with timestamps.

## 🚀 Usage

### Run tests with unique report names

```bash
# Normal test (overwrites reports)
npm test

# Test with timestamp folders (preserves reports)
npm run test:unique
npm run test:unique:headed

# Or use environment variable directly
ARCHIVE_REPORTS=true npm test
ARCHIVE_REPORTS=true npm run test:headed
```

### What you get

```text
test-results/
├── html/                          # HTML reports
│   ├── index.html                # Latest HTML report
│   ├── data/                     # Report data
│   ├── trace/                    # Trace files
│   ├── 2025-09-24T15-30-45_local/  # Archived HTML reports
│   └── 2025-09-24T16-45-12_local/
├── allure/                       # Allure results
│   ├── *.json                    # Allure result files
│   └── 2025-09-24T15-30-45_local/  # Archived allure results
└── output/                       # Test artifacts
    ├── junit.xml                 # JUnit XML results
    ├── results.json              # JSON test results
    └── 2025-09-24T15-30-45_local/  # Archived artifacts
```

### View reports

```bash
# View latest report automatically
npm run report:html:latest

# View normal report (if exists)
npm run report:html

# Clean all old reports when needed
npm run report:clean
```

## 🎛️ How it Works

The playwright config automatically detects the `ARCHIVE_REPORTS` environment variable and:

- Adds timestamp to report folder names
- Includes git branch name
- Keeps reports separate for each test run

## 💡 When to Use

- **Regular development**: Use normal commands (`npm test`)
- **Important test runs**: Use unique commands (`npm run test:unique`)
- **Before releases**: Use unique commands to preserve results
- **Different branches**: Automatic branch names in folder

## 🧹 Cleanup

When you have too many report folders:

```bash
npm run report:clean  # Removes all playwright-report*, allure-results*, test-results*
```

---

Simple and effective! 🎯