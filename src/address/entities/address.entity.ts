

import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import { User } from 'src/user/entities/user.entity';
  
  @Entity()
  export class Address {

  @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 40 })
    name: string;
  
    @Column()
    mobile_number: string;

    @Column()
    city: string;

    @Column()
    address: string;

    @Column()
    address_type: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.addresses)
    user: User
  
    
  }
  