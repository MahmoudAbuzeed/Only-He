import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepo } from "../../user/repositories/user.repository";
import { CartIdentity } from "../cart.service";

/**
 * Guard that allows either:
 * - Authenticated user (Authorization: Bearer <token>) -> sets req.user and req.cartIdentity = { userId }
 * - Guest cart (X-Guest-Cart-Id header) -> sets req.cartIdentity = { guestCartId }
 * Fails if neither is provided.
 */
@Injectable()
export class CartIdentityGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepo
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const guestCartId = request.headers["x-guest-cart-id"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET || "your-secret-key",
        });
        if (payload.type !== "auth") {
          throw new UnauthorizedException(
            "Invalid token type. Please complete registration."
          );
        }
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
        request.user = user;
        request.cartIdentity = { userId: user.id } as CartIdentity;
        return true;
      } catch (error) {
        if (
          error instanceof UnauthorizedException ||
          error instanceof BadRequestException
        ) {
          throw error;
        }
        throw new UnauthorizedException("Invalid or expired token");
      }
    }

    if (guestCartId && typeof guestCartId === "string" && guestCartId.trim()) {
      request.cartIdentity = {
        guestCartId: guestCartId.trim(),
      } as CartIdentity;
      return true;
    }

    throw new BadRequestException(
      "Cart identity required. Provide Authorization: Bearer <token> or X-Guest-Cart-Id header."
    );
  }
}
