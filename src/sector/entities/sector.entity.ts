import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import { Component } from 'src/component/entities/component.entity';
import { Task } from 'src/task/entities/task.entity';

@Entity()
export class Sector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany((type) => Project, (project) => project.sectors, {
    eager: false,
  })
  @JoinTable()
  projects: Project[];

  @ManyToMany((type) => Component, (component) => component.sectors, {
    eager: false,
  })
  @JoinTable()
  components: Component[];

  @ManyToMany((type) => Task, (task) => task.sectors, {
    eager: false,
  })
  @JoinTable()
  tasks: Task[];
}
