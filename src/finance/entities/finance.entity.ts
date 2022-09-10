import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Project } from 'src/project/entities/project.entity';

@Entity()
export class Finance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  account_number: number;

  @Column({ nullable: true })
  first_withdrawal_date: Date;

  @Column({ nullable: true })
  final_withdrawal_date: Date;

  @Column({ nullable: true })
  account_activation_date: Date;

  @Column({ nullable: true })
  general_information: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Project)
  project: Project;
}
