import { LocalStrategy } from "./local.strategy";
import { Controller, Post, UseGuards, Request, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalStrategy)
  @Post("login")
  async login(@Body() user) {
    return this.authService.login(user);
  }

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post("refresh")
  async refresh(@Body() body: any) {
    return this.authService.refreshToken(body.userId);
  }

  @Post("logout")
  async logout(@Body() body: any) {
    await this.authService.logout(body.userId);
    return { message: "Logged out successfully" };
  }
}
