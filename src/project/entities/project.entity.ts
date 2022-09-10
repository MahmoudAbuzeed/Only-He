import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Department } from 'src/department/entities/department.entity';
import { Sector } from 'src/sector/entities/sector.entity';
import { StackHolder } from 'src/stack-holder/entities/stack-holder.entity';

@Entity()
export class Project {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  name: string;

  @Column({ length: 40 })
  reference_id: string;

  @Column({ length: 40 })
  status: string;

  @Column()
  budget: number;

  @Column({ length: 40 })
  type: string;

  @Column({ nullable: true })
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;

  @Column()
  description: string;

  @Column({ default: false })
  finance_approval: boolean;

  @Column({ default: false })
  gl_approval: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Department)
  department: Department;

  @ManyToMany((type) => Sector, (sectors) => sectors.projects, {
    eager: false,
    cascade: true,
  })
  sectors: Sector[];

  @ManyToMany((type) => StackHolder, (stackHolders) => stackHolders.projects, {
    eager: false,
    cascade: true,
  })
  stackHolders: StackHolder[];
}
