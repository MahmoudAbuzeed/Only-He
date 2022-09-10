import { ProjectHistory } from './project-history/entities/project-history.entity';
import { TaskReference } from './task-reference/entities/task-reference.entity';
import { StackHolder } from './stack-holder/entities/stack-holder.entity';
import { SectorPlan } from './sector-plan/entities/sector-plan.entity';
import { SectorGoal } from './sector-goal/entities/sector-goal.entity';
import { Attachment } from './attachment/entities/attachment.entity';
import { Department } from './department/entities/department.entity';
import { Component } from './component/entities/component.entity';
import { Project } from './project/entities/project.entity';
import { Sector } from './sector/entities/sector.entity';
import { Task } from './task/entities/task.entity';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { ProjectObjective } from './project-objective/entities/project-objective.entity';
import { Finance } from './finance/entities/finance.entity';

export const entities = [
  ProjectObjective,
  ProjectHistory,
  TaskReference,
  StackHolder,
  Attachment,
  SectorPlan,
  SectorGoal,
  Department,
  Component,
  Project,
  Sector,
  Task,
  User,
  Role,
  Finance,
];
