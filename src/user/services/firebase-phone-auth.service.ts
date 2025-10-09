import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class FirebasePhoneAuthService implements OnModuleInit {
  private readonly logger = new Logger(FirebasePhoneAuthService.name);
  private firebaseApp: admin.app.App;

  onModuleInit() {
    try {
      // Initialize Firebase Admin SDK
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : null;

      if (serviceAccount) {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        this.logger.log("✅ Firebase Admin SDK initialized successfully");
      } else if (process.env.FIREBASE_PROJECT_ID) {
        // For development with service account file
        const serviceAccountPath =
          process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
          "./firebase-service-account.json";

        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
        this.logger.log("✅ Firebase Admin SDK initialized from file");
      } else {
        this.logger.warn(
          "⚠️  Firebase credentials not configured. Phone auth will not work."
        );
      }
    } catch (error) {
      this.logger.error("❌ Failed to initialize Firebase:", error.message);
      throw error;
    }
  }

  /**
   * Verify Firebase ID token from client
   * This is called after the client has verified the OTP with Firebase
   */
  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      this.logger.log(`Token verified for user: ${decodedToken.uid}`);
      return decodedToken;
    } catch (error) {
      this.logger.error("Failed to verify ID token:", error.message);
      throw new Error("Invalid or expired Firebase token");
    }
  }

  /**
   * Get user by phone number
   */
  async getUserByPhoneNumber(
    phoneNumber: string
  ): Promise<admin.auth.UserRecord | null> {
    try {
      const user = await admin.auth().getUserByPhoneNumber(phoneNumber);
      return user;
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return null;
      }
      this.logger.error("Error getting user by phone:", error.message);
      throw error;
    }
  }

  /**
   * Get user by Firebase UID
   */
  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await admin.auth().getUser(uid);
    } catch (error) {
      this.logger.error("Error getting user by UID:", error.message);
      throw error;
    }
  }

  /**
   * Create custom token for user (useful for additional authentication flows)
   */
  async createCustomToken(
    uid: string,
    additionalClaims?: object
  ): Promise<string> {
    try {
      return await admin.auth().createCustomToken(uid, additionalClaims);
    } catch (error) {
      this.logger.error("Error creating custom token:", error.message);
      throw error;
    }
  }

  /**
   * Delete Firebase user (cleanup)
   */
  async deleteUser(uid: string): Promise<void> {
    try {
      await admin.auth().deleteUser(uid);
      this.logger.log(`Firebase user deleted: ${uid}`);
    } catch (error) {
      this.logger.error("Error deleting Firebase user:", error.message);
      throw error;
    }
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone: string): boolean {
    // E.164 format: +[country code][number]
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
}
