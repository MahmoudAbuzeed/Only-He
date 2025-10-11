import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 100 })
  label: string; // "Home", "Work", "Parents", etc.

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ length: 200, nullable: true })
  company: string;

  @Column({ length: 200 })
  address_line_1: string;

  @Column({ length: 200, nullable: true })
  address_line_2: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  state: string;

  @Column({ length: 20 })
  postal_code: string;

  @Column({ length: 100 })
  country: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ default: false })
  is_default_shipping: boolean;

  @Column({ default: false })
  is_default_billing: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

