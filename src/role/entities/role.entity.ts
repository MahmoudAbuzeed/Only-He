import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

export enum RoleType {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  MANAGER = 'manager',
  STAFF = 'staff',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40, unique: true })
  name: string;

  @Column()
  details: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.CUSTOMER })
  type: RoleType;

  @Column({ type: 'json', nullable: true })
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

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
