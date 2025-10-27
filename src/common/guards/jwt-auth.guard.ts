import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepo } from "../../user/repositories/user.repository";

/**
 * JWT Authentication Guard for regular users
 * Verifies JWT token and attaches user to request object
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepo
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract JWT token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Access token required");
    }

    const token = authHeader.substring(7);

    try {
      // Verify JWT token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || "your-secret-key",
      });

      // Validate token type (should be 'auth', not 'temp')
      if (payload.type !== "auth") {
        throw new UnauthorizedException(
          "Invalid token type. Please complete registration."
        );
      }

      // Get user from database
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ["roles"],
      });

      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      if (!user.is_active) {
        throw new UnauthorizedException("Account is inactive");
      }

      // Attach user to request object
      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
