import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from "class-validator";

export class CompleteRegistrationDto {
  @ApiProperty({
    description: "Temporary token received after OTP verification",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsString()
  @IsNotEmpty()
  tempToken: string;

  @ApiProperty({
    description: "User's first name",
    example: "John",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(40)
  first_name: string;

  @ApiProperty({
    description: "User's last name",
    example: "Doe",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(40)
  last_name: string;

  @ApiProperty({
    description: "Username",
    example: "johndoe",
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(40)
  user_name?: string;

  @ApiProperty({
    description: "Email address (optional)",
    example: "john@example.com",
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}

