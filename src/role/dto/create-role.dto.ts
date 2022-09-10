import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { User } from 'src/user/entities/user.entity';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsNumber()
  @IsNotEmpty()
  user: User;
}
