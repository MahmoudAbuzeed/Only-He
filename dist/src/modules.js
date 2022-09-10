"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modules = void 0;
const project_history_module_1 = require("./project-history/project-history.module");
const stack_holder_module_1 = require("./stack-holder/stack-holder.module");
const attachment_module_1 = require("./attachment/attachment.module");
const component_module_1 = require("./component/component.module");
const project_module_1 = require("./project/project.module");
const task_module_1 = require("./task/task.module");
const task_reference_module_1 = require("./task-reference/task-reference.module");
const sector_module_1 = require("./sector/sector.module");
const sector_plan_module_1 = require("./sector-plan/sector-plan.module");
const sector_goal_module_1 = require("./sector-goal/sector-goal.module");
const user_module_1 = require("./user/user.module");
const role_module_1 = require("./role/role.module");
const department_module_1 = require("./department/department.module");
const project_objective_module_1 = require("./project-objective/project-objective.module");
const finance_module_1 = require("./finance/finance.module");
exports.modules = [
    project_module_1.ProjectModule,
    stack_holder_module_1.StackHolderModule,
    attachment_module_1.AttachmentModule,
    project_history_module_1.ProjectHistoryModule,
    component_module_1.ComponentModule,
    task_module_1.TaskModule,
    task_reference_module_1.TaskReferenceModule,
    sector_module_1.SectorModule,
    sector_plan_module_1.SectorPlanModule,
    sector_goal_module_1.SectorGoalModule,
    user_module_1.UserModule,
    role_module_1.RoleModule,
    department_module_1.DepartmentModule,
    project_objective_module_1.ProjectObjectiveModule,
    finance_module_1.FinanceModule,
];
//# sourceMappingURL=modules.js.map