import { IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({ 
    description: 'Array of role IDs to assign to user',
    example: [1, 2],
    type: [Number]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  role_ids: number[];

  @ApiPropertyOptional({ 
    description: 'Whether to replace existing roles or add to them',
    example: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  replace_existing?: boolean = false;
}
