import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface CustomReporterOptions {
  htmlReportDir: string;
  allureResultsDir: string;
  testRunId: string;
  latestHtmlDir: string;
  latestAllureDir: string;
}

class TimestampedReporter implements Reporter {
  private options: CustomReporterOptions;
  private startTime: number = 0;
  private testCount: number = 0;
  private passedCount: number = 0;
  private failedCount: number = 0;

  constructor(options: CustomReporterOptions) {
    this.options = options;
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    this.testCount = suite.allTests().length;
    
    console.log('\n🚀 Starting Playwright Test Run');
    console.log(`📊 Tests to run: ${this.testCount}`);
    console.log(`🕒 Run ID: ${this.options.testRunId}`);
    console.log(`📁 HTML Report: ${this.options.htmlReportDir}`);
    console.log(`📁 Allure Results: ${this.options.allureResultsDir}\n`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'passed') {
      this.passedCount++;
    } else {
      this.failedCount++;
    }
  }

  async onEnd(result: FullResult) {
    const duration = Date.now() - this.startTime;
    const durationFormatted = this.formatDuration(duration);
    
    console.log('\n📋 Test Run Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Passed: ${this.passedCount}`);
    console.log(`❌ Failed: ${this.failedCount}`);
    console.log(`⏱️  Duration: ${durationFormatted}`);
    console.log(`🆔 Run ID: ${this.options.testRunId}`);
    
    // Move Allure results to timestamped directory
    await this.moveAllureResults();
    
    // Create symlinks to latest reports
    await this.createSymlinks();
    
    // Generate report summary file
    await this.generateReportSummary(result, duration);
    
    console.log('\n📊 Report Generation');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📄 HTML Report: ${this.options.htmlReportDir}/index.html`);
    console.log(`📄 Latest HTML: ${this.options.latestHtmlDir}/index.html`);
    console.log(`🎯 Allure Results: ${this.options.allureResultsDir}`);
    console.log(`🎯 Latest Allure: ${this.options.latestAllureDir}`);
    
    console.log('\n🔗 Quick Commands');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`View HTML Report:  npx playwright show-report "${this.options.htmlReportDir}"`);
    console.log(`View Latest HTML:  npx playwright show-report "${this.options.latestHtmlDir}"`);
    console.log(`Generate Allure:   allure serve "${this.options.allureResultsDir}"`);
    console.log(`Latest Allure:     allure serve "${this.options.latestAllureDir}"`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  private async createSymlinks() {
    try {
      // Create directories if they don't exist
      const htmlParentDir = path.dirname(this.options.latestHtmlDir);
      const allureParentDir = path.dirname(this.options.latestAllureDir);
      
      if (!fs.existsSync(htmlParentDir)) {
        fs.mkdirSync(htmlParentDir, { recursive: true });
      }
      if (!fs.existsSync(allureParentDir)) {
        fs.mkdirSync(allureParentDir, { recursive: true });
      }

      // Remove existing symlinks if they exist
      if (fs.existsSync(this.options.latestHtmlDir)) {
        fs.unlinkSync(this.options.latestHtmlDir);
      }
      if (fs.existsSync(this.options.latestAllureDir)) {
        fs.unlinkSync(this.options.latestAllureDir);
      }

      // Create new symlinks
      const htmlTarget = path.resolve(this.options.htmlReportDir);
      const allureTarget = path.resolve(this.options.allureResultsDir);
      
      fs.symlinkSync(htmlTarget, this.options.latestHtmlDir, 'dir');
      fs.symlinkSync(allureTarget, this.options.latestAllureDir, 'dir');
      
      console.log('🔗 Created symlinks to latest reports');
    } catch (error) {
      console.warn('⚠️  Failed to create symlinks:', error);
    }
  }

  private async moveAllureResults() {
    try {
      const rootAllureDir = 'allure-results';
      if (fs.existsSync(rootAllureDir)) {
        // Create the timestamped directory
        fs.mkdirSync(this.options.allureResultsDir, { recursive: true });
        
        // Move all files from root allure-results to timestamped directory
        const files = fs.readdirSync(rootAllureDir);
        for (const file of files) {
          const srcPath = path.join(rootAllureDir, file);
          const destPath = path.join(this.options.allureResultsDir, file);
          fs.renameSync(srcPath, destPath);
        }
        
        // Remove the empty root directory
        fs.rmdirSync(rootAllureDir);
        console.log('🎯 Moved Allure results to timestamped directory');
      }
    } catch (error) {
      console.warn('⚠️  Failed to move Allure results:', error);
    }
  }

  private async generateReportSummary(result: FullResult, duration: number) {
    const summary = {
      testRunId: this.options.testRunId,
      timestamp: new Date().toISOString(),
      status: result.status,
      duration: duration,
      durationFormatted: this.formatDuration(duration),
      stats: {
        total: this.testCount,
        passed: this.passedCount,
        failed: this.failedCount,
        skipped: this.testCount - this.passedCount - this.failedCount
      },
      reports: {
        html: this.options.htmlReportDir,
        allure: this.options.allureResultsDir,
        latestHtml: this.options.latestHtmlDir,
        latestAllure: this.options.latestAllureDir
      }
    };

    const summaryFile = path.join(path.dirname(this.options.htmlReportDir), 'summary.json');
    const latestSummaryFile = 'test-results/latest-summary.json';
    
    try {
      // Ensure directory exists
      fs.mkdirSync(path.dirname(summaryFile), { recursive: true });
      
      // Write summary files
      fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
      fs.writeFileSync(latestSummaryFile, JSON.stringify(summary, null, 2));
      
      console.log('📋 Generated report summary files');
    } catch (error) {
      console.warn('⚠️  Failed to write summary files:', error);
    }
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

export default TimestampedReporter;