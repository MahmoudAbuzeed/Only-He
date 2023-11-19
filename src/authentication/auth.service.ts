import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const userDetails = await this.usersService.findOneByEmail(user.email);
    const payload = { email: user.email, sub: userDetails.id };
    const jwtSecret = this.configService.get<string>("JWT_SECRET");

    const accessToken = this.jwtService.sign(payload, { expiresIn: "15m", secret: jwtSecret });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d", secret: jwtSecret });

    await this.usersService.saveRefreshToken(userDetails.id, refreshToken);
    return {
      user: {
        id: userDetails.id,
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        user_name: userDetails.user_name,
        email: userDetails.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: number) {
    const user = await this.usersService.findOneById(userId);
    const payload = { username: user.user_name, sub: user.id };
    const jwtSecret = this.configService.get<string>("JWT_SECRET");

    return {
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        email: user.email,
      },
      access_token: this.jwtService.sign(payload, { expiresIn: "15m", secret: jwtSecret }),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      user_name: createUserDto.first_name + " " + createUserDto.last_name,
      password: hashedPassword,
    });

    // Omit the password before returning the user object
    const { password, ...result } = user;
    return result;
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.invalidateRefreshToken(userId);
  }
}
