import { credentialsManager, TestUser } from '../config/config.manager';
import { logger } from './logger';

export type UserType = 'superAdmin' | 'allianceAdmin' | 'leaAdmin';

export interface UserData {
  email: string;
  password: string;
  description?: string;
  userType: UserType;
}

export class UserManager {
  private static instance: UserManager;

  private constructor() {}

  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  /**
   * Get user data by user type
   */
  public getUser(userType: UserType): UserData {
    const testUser = credentialsManager.getTestUser(userType);
    
    return {
      email: testUser.username,
      password: testUser.password,
      description: testUser.description,
      userType: userType,
    };
  }

  /**
   * Get all available users
   */
  public getAllUsers(): Record<UserType, UserData> {
    const allUsers = credentialsManager.getAllTestUsers();
    
    return {
      superAdmin: this.getUser('superAdmin'),
      allianceAdmin: this.getUser('allianceAdmin'),
      leaAdmin: this.getUser('leaAdmin'),
    };
  }

  /**
   * Get a random user from available users
   */
  public getRandomUser(): UserData {
    const userTypes: UserType[] = ['superAdmin', 'allianceAdmin', 'leaAdmin'];
    const randomIndex = Math.floor(Math.random() * userTypes.length);
    const randomUserType = userTypes[randomIndex];
    
    return this.getUser(randomUserType);
  }

  /**
   * Get users by criteria (for future extensibility)
   */
  public getUsersByRole(role: 'admin'): UserData[] {
    const allUsers = this.getAllUsers();
    
    // All current users are admin-type, but this can be extended
    return Object.values(allUsers);
  }

  /**
   * Log user information
   */
  public logUserInfo(userType: UserType): void {
    const user = this.getUser(userType);
    logger.info(`Using ${userType}: ${user.email} (${user.description || 'No description'})`);
  }

  /**
   * Validate if user type exists
   */
  public isValidUserType(userType: string): userType is UserType {
    return ['superAdmin', 'allianceAdmin', 'leaAdmin'].includes(userType);
  }
}

// Export singleton instance
export const userManager = UserManager.getInstance();

// Export convenient methods for direct use
export const getUser = (userType: UserType) => userManager.getUser(userType);
export const getAllUsers = () => userManager.getAllUsers();
export const getRandomUser = () => userManager.getRandomUser();