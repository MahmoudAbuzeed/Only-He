import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class VerifyFirebaseTokenDto {
  @ApiProperty({
    description:
      "Firebase ID token received after successful OTP verification on the client",
    example:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ0OTU4M2ZkZGY1MDhkMzIyMzQwZmM3ZDQ4NTU2ZGQwYjJiYjM5ZjQiLCJ0eXAiOiJKV1QifQ...",
  })
  @IsString()
  @IsNotEmpty()
  firebaseToken: string;
}
