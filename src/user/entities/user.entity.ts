import { Address } from "src/address/entities/address.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  first_name: string;

  @Column({ length: 40 })
  last_name: string;

  @Column({ length: 40 })
  user_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  mobile_number: string;

  @Column()
  profile_picture: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Address, (address) => address.user)
    addresses: Address[]
}
