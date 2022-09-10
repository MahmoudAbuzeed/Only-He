import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import { Component } from 'src/component/entities/component.entity';
import { Task } from 'src/task/entities/task.entity';

@Entity()
export class StackHolder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  title: string;

  @Column({ length: 40 })
  name: string;

  @Column({ length: 20 })
  phone_number: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany((type) => Project, (project) => project.stackHolders, {
    eager: false,
  })
  @JoinTable()
  projects: Project[];

  @ManyToMany((type) => Component, (component) => component.stackHolders, {
    eager: false,
  })
  @JoinTable()
  components: Component[];

  @ManyToMany((type) => Task, (task) => task.stackHolders, {
    eager: false,
  })
  @JoinTable()
  tasks: Task[];
}
