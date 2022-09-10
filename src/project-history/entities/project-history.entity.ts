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
export class ProjectHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  from_status: string;

  @Column({ length: 40 })
  to_status: string;

  @Column()
  message: string;

  @Column()
  editor_id: string;

  @Column()
  department_type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Project)
  project: Project;
}
