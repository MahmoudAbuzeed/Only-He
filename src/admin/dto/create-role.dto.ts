import { IsString, IsNotEmpty, IsEnum, IsObject, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '../../role/entities/role.entity';

export class CreateRoleDto {
  @ApiProperty({ 
    description: 'Role name',
    example: 'Product Manager'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Role description',
    example: 'Manages product catalog and inventory'
  })
  @IsString()
  @IsNotEmpty()
  details: string;

  @ApiProperty({ 
    description: 'Role type',
    enum: RoleType,
    example: RoleType.STAFF
  })
  @IsEnum(RoleType)
  type: RoleType;

  @ApiProperty({ 
    description: 'Role permissions',
    example: {
      products: {
        create: true,
        read: true,
        update: true,
        delete: false,
        manage_stock: true
      },
      categories: {
        create: true,
        read: true,
        update: true,
        delete: false
      }
    }
  })
  @IsObject()
  permissions: {
    users?: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
      assign_roles?: boolean;
    };
    products?: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
      manage_stock?: boolean;
    };
    categories?: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
    };
    orders?: {
      read?: boolean;
      update?: boolean;
      cancel?: boolean;
      refund?: boolean;
      track?: boolean;
    };
    packages?: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
    };
    offers?: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
    };
    analytics?: {
      view_dashboard?: boolean;
      view_reports?: boolean;
      export_data?: boolean;
    };
  };

  @ApiPropertyOptional({ 
    description: 'Whether role is active',
    example: true,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
