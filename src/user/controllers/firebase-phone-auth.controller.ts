import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { FirebaseAuthHandlerService } from "../services/firebase-auth-handler.service";
import { VerifyFirebaseTokenDto } from "../dto/verify-firebase-token.dto";
import { CompleteRegistrationDto } from "../dto/complete-registration.dto";

@ApiTags("Firebase Phone Authentication")
@Controller("auth/firebase")
export class FirebasePhoneAuthController {
  constructor(
    private readonly firebaseAuthHandler: FirebaseAuthHandlerService
  ) {}

  @Post("verify-token")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Verify Firebase phone authentication token",
    description:
      "After the client verifies OTP with Firebase, send the Firebase ID token to this endpoint. Returns auth token for existing users or temp token for new users.",
  })
  @ApiBody({ type: VerifyFirebaseTokenDto })
  @ApiResponse({
    status: 200,
    description: "Token verified successfully",
    schema: {
      oneOf: [
        {
          title: "Existing User",
          example: {
            isNewUser: false,
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            user: {
              id: 1,
              first_name: "John",
              last_name: "Doe",
              phone: "+1234567890",
              email: "john@example.com",
              phone_verified: true,
            },
            message: "Login successful",
          },
        },
        {
          title: "New User",
          example: {
            isNewUser: true,
            tempToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            message: "Phone verified. Please complete your profile.",
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid or expired Firebase token",
  })
  async verifyToken(@Body() verifyTokenDto: VerifyFirebaseTokenDto) {
    return this.firebaseAuthHandler.verifyFirebaseToken(verifyTokenDto);
  }

  @Post("complete-registration")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Complete registration for new users (Firebase flow)",
    description:
      "Complete user profile after Firebase phone verification. Requires temporary token from verify-token endpoint.",
  })
  @ApiBody({ type: CompleteRegistrationDto })
  @ApiResponse({
    status: 201,
    description: "Registration completed successfully",
    schema: {
      example: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          user_name: "johndoe",
          phone: "+1234567890",
          email: "john@example.com",
          phone_verified: true,
        },
        message: "Registration completed successfully",
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid or expired temporary token",
  })
  @ApiResponse({
    status: 409,
    description: "User already exists or email already in use",
  })
  async completeRegistration(
    @Body() completeRegistrationDto: CompleteRegistrationDto
  ) {
    return this.firebaseAuthHandler.completeRegistration(
      completeRegistrationDto
    );
  }
}
