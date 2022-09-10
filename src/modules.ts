import { ProjectHistoryModule } from './project-history/project-history.module';
import { StackHolderModule } from './stack-holder/stack-holder.module';
import { AttachmentModule } from './attachment/attachment.module';
import { ComponentModule } from './component/component.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TaskReferenceModule } from './task-reference/task-reference.module';
import { SectorModule } from './sector/sector.module';
import { SectorPlanModule } from './sector-plan/sector-plan.module';
import { SectorGoalModule } from './sector-goal/sector-goal.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { DepartmentModule } from './department/department.module';
import { ProjectObjectiveModule } from './project-objective/project-objective.module';
import { FinanceModule } from './finance/finance.module';

export const modules = [
  ProjectModule,
  StackHolderModule,
  AttachmentModule,
  ProjectHistoryModule,
  ComponentModule,
  TaskModule,
  TaskReferenceModule,
  SectorModule,
  SectorPlanModule,
  SectorGoalModule,
  UserModule,
  RoleModule,
  DepartmentModule,
  ProjectObjectiveModule,
  FinanceModule,
];
