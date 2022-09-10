import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Component } from 'src/component/entities/component.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { StackHolder } from 'src/stack-holder/entities/stack-holder.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  name: string;

  @Column()
  budget: number;

  @Column()
  description: string;

  @Column()
  approval_requirements: string;

  @Column()
  priority: string;

  @Column()
  man_power: number;

  @Column({ nullable: true })
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;

  // @Column()
  // weight: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Component)
  component: Component;

  @ManyToMany((type) => Sector, (sector) => sector.tasks, {
    eager: false,
    cascade: true,
  })
  sectors: Sector[];

  @ManyToMany((type) => StackHolder, (stackHolders) => stackHolders.tasks, {
    eager: false,
    cascade: true,
  })
  stackHolders: StackHolder[];
}
