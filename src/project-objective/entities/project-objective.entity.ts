import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from 'src/project/entities/project.entity';

@Entity()
export class ProjectObjective {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  goal: string;

  @ManyToOne(() => Project)
  project: Project;
}
