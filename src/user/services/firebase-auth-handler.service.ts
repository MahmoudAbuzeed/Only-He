import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepo } from "../repositories/user.repository";
import { FirebasePhoneAuthService } from "./firebase-phone-auth.service";
import { VerifyFirebaseTokenDto } from "../dto/verify-firebase-token.dto";
import { CompleteRegistrationDto } from "../dto/complete-registration.dto";
import { User } from "../entities/user.entity";
import { ResponseUtil } from "../../common/utils/response.util";

@Injectable()
export class FirebaseAuthHandlerService {
  private readonly logger = new Logger(FirebaseAuthHandlerService.name);

  constructor(
    private readonly userRepository: UserRepo,
    private readonly firebaseService: FirebasePhoneAuthService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Verify Firebase token and authenticate user
   * Returns auth token for existing users or temp token for new users
   */
  async verifyFirebaseToken(verifyTokenDto: VerifyFirebaseTokenDto) {
    const { firebaseToken } = verifyTokenDto;

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await this.firebaseService.verifyIdToken(firebaseToken);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "Invalid or expired Firebase token",
          error: "INVALID_FIREBASE_TOKEN",
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Phone number not found in Firebase token",
          error: "PHONE_NOT_FOUND",
        },
        HttpStatus.BAD_REQUEST
      );
    }

    // Check if user exists in our database
    const existingUser = await this.userRepository.findOne({
      where: { phone: phoneNumber },
      relations: ["roles"],
    });

    if (existingUser) {
      // Existing user - return full token
      const token = this.generateAuthToken(existingUser);

      // Update last login and phone verified status
      existingUser.last_login = new Date();
      existingUser.phone_verified = true;
      await this.userRepository.save(existingUser);

      return ResponseUtil.success("Login successful", {
        isNewUser: false,
        token,
        user: this.sanitizeUser(existingUser),
      });
    } else {
      // New user - return temporary token for registration
      const tempToken = this.generateTempToken(phoneNumber, decodedToken.uid);

      return ResponseUtil.success(
        "Phone verified. Please complete your profile.",
        {
          isNewUser: true,
          tempToken,
        }
      );
    }
  }

  /**
   * Complete registration for new users (Firebase flow)
   */
  async completeRegistration(completeRegistrationDto: CompleteRegistrationDto) {
    const { tempToken, first_name, last_name, user_name, email } =
      completeRegistrationDto;

    // Verify temporary token
    let payload: any;
    try {
      payload = this.jwtService.verify(tempToken, {
        secret: process.env.JWT_SECRET || "your-secret-key",
      });

      if (payload.type !== "temp") {
        throw new Error("Invalid token type");
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: "Invalid or expired temporary token",
          error: "INVALID_TEMP_TOKEN",
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const phone = payload.phone;
    const firebaseUid = payload.firebaseUid;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { phone },
    });

    if (existingUser) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: "User already registered",
          error: "USER_EXISTS",
        },
        HttpStatus.CONFLICT
      );
    }

    // Check if email is already in use (if provided)
    if (email) {
      const emailExists = await this.userRepository.findOne({
        where: { email },
      });

      if (emailExists) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: "Email already in use",
            error: "EMAIL_EXISTS",
          },
          HttpStatus.CONFLICT
        );
      }
    }

    // Create new user
    const newUser = this.userRepository.createEntity({
      phone,
      first_name,
      last_name,
      user_name: user_name || `user_${Date.now()}`,
      email: email || null,
      password: null, // Phone authentication doesn't require password
      phone_verified: true,
      is_active: true,
      last_login: new Date(),
    });

    await this.userRepository.save(newUser);

    // Load user with relations
    const userWithRoles = await this.userRepository.findOne({
      where: { id: newUser.id },
      relations: ["roles"],
    });

    // Generate auth token
    const token = this.generateAuthToken(userWithRoles);

    return ResponseUtil.success("Registration completed successfully", {
      token,
      user: this.sanitizeUser(userWithRoles),
    });
  }

  /**
   * Generate authentication JWT token
   */
  private generateAuthToken(user: User): string {
    const payload = {
      sub: user.id,
      phone: user.phone,
      email: user.email,
      roles: user.roles?.map((role) => role.name) || [],
      type: "auth",
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || "your-secret-key",
      expiresIn: "30d", // 30 days
    });
  }

  /**
   * Generate temporary JWT token (valid for 10 minutes)
   */
  private generateTempToken(phone: string, firebaseUid: string): string {
    const payload = {
      phone,
      firebaseUid,
      type: "temp",
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || "your-secret-key",
      expiresIn: "10m", // 10 minutes
    });
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: User): Partial<User> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
