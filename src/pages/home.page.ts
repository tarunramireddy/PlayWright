import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '@utils/index';

/**
 * Home Page Object Model
 */
export class HomePage extends BasePage {
  // Header elements
  private readonly header: Locator;
  private readonly logo: Locator;
  private readonly userMenu: Locator;
  private readonly logoutButton: Locator;
  private readonly profileLink: Locator;
  private readonly settingsLink: Locator;
  
  // Navigation elements
  private readonly navigationMenu: Locator;
  private readonly homeNavLink: Locator;
  private readonly productsNavLink: Locator;
  private readonly aboutNavLink: Locator;
  private readonly contactNavLink: Locator;
  
  // Main content elements
  private readonly welcomeMessage: Locator;
  private readonly mainContent: Locator;
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  
  // Footer elements
  private readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    
    // Header locators
    this.header = this.locator('[data-testid="header"]');
    this.logo = this.locator('[data-testid="logo"]');
    this.userMenu = this.locator('[data-testid="user-menu"]');
    this.logoutButton = this.locator('[data-testid="logout-button"]');
    this.profileLink = this.locator('[data-testid="profile-link"]');
    this.settingsLink = this.locator('[data-testid="settings-link"]');
    
    // Navigation locators
    this.navigationMenu = this.locator('[data-testid="navigation-menu"]');
    this.homeNavLink = this.locator('[data-testid="nav-home"]');
    this.productsNavLink = this.locator('[data-testid="nav-products"]');
    this.aboutNavLink = this.locator('[data-testid="nav-about"]');
    this.contactNavLink = this.locator('[data-testid="nav-contact"]');
    
    // Main content locators
    this.welcomeMessage = this.locator('[data-testid="welcome-message"]');
    this.mainContent = this.locator('[data-testid="main-content"]');
    this.searchBox = this.locator('[data-testid="search-box"]');
    this.searchButton = this.locator('[data-testid="search-button"]');
    
    // Footer locators
    this.footer = this.locator('[data-testid="footer"]');
  }

  /**
   * Get home page URL
   */
  getUrl(): string {
    return `${this.config.baseUrl}/home`;
  }

  /**
   * Check if home page is loaded
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.verifyElementVisible(this.header);
      await this.verifyElementVisible(this.navigationMenu);
      await this.verifyElementVisible(this.mainContent);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    logger.step('Getting welcome message');
    await this.waitForElement(this.welcomeMessage);
    return await this.getText(this.welcomeMessage);
  }

  /**
   * Click on logo
   */
  async clickLogo(): Promise<void> {
    logger.step('Clicking logo');
    await this.click(this.logo);
  }

  /**
   * Open user menu
   */
  async openUserMenu(): Promise<void> {
    logger.step('Opening user menu');
    await this.click(this.userMenu);
    await this.waitForElement(this.profileLink);
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    logger.step('Logging out');
    await this.openUserMenu();
    await this.click(this.logoutButton);
  }

  /**
   * Click profile link
   */
  async goToProfile(): Promise<void> {
    logger.step('Going to profile page');
    await this.openUserMenu();
    await this.click(this.profileLink);
  }

  /**
   * Click settings link
   */
  async goToSettings(): Promise<void> {
    logger.step('Going to settings page');
    await this.openUserMenu();
    await this.click(this.settingsLink);
  }

  /**
   * Navigate using main navigation menu
   */
  async navigateToProducts(): Promise<void> {
    logger.step('Navigating to products');
    await this.click(this.productsNavLink);
  }

  async navigateToAbout(): Promise<void> {
    logger.step('Navigating to about page');
    await this.click(this.aboutNavLink);
  }

  async navigateToContact(): Promise<void> {
    logger.step('Navigating to contact page');
    await this.click(this.contactNavLink);
  }

  async navigateToHome(): Promise<void> {
    logger.step('Navigating to home page');
    await this.click(this.homeNavLink);
  }

  /**
   * Perform search
   */
  async search(searchTerm: string): Promise<void> {
    logger.step(`Searching for: ${searchTerm}`);
    await this.fill(this.searchBox, searchTerm, { clear: true });
    await this.click(this.searchButton);
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    logger.step('Checking if user is logged in');
    return await this.isVisible(this.userMenu);
  }

  /**
   * Verify home page elements are present
   */
  async verifyHomePageElements(): Promise<void> {
    logger.step('Verifying home page elements');
    
    // Header elements
    await this.verifyElementVisible(this.header);
    await this.verifyElementVisible(this.logo);
    await this.verifyElementVisible(this.userMenu);
    
    // Navigation elements
    await this.verifyElementVisible(this.navigationMenu);
    await this.verifyElementVisible(this.homeNavLink);
    await this.verifyElementVisible(this.productsNavLink);
    await this.verifyElementVisible(this.aboutNavLink);
    await this.verifyElementVisible(this.contactNavLink);
    
    // Main content elements
    await this.verifyElementVisible(this.mainContent);
    await this.verifyElementVisible(this.searchBox);
    await this.verifyElementVisible(this.searchButton);
    
    // Footer
    await this.verifyElementVisible(this.footer);
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageToLoad(): Promise<void> {
    logger.step('Waiting for home page to fully load');
    await this.waitForPageLoad();
    await this.waitForElement(this.header);
    await this.waitForElement(this.mainContent);
  }

  /**
   * Check if navigation menu is visible
   */
  async isNavigationVisible(): Promise<boolean> {
    return await this.isVisible(this.navigationMenu);
  }

  /**
   * Get current user from user menu (if available)
   */
  async getCurrentUser(): Promise<string | null> {
    logger.step('Getting current user information');
    try {
      if (await this.isVisible(this.userMenu)) {
        return await this.getText(this.userMenu);
      }
      return null;
    } catch {
      return null;
    }
  }
}