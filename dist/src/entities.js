"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
const project_history_entity_1 = require("./project-history/entities/project-history.entity");
const task_reference_entity_1 = require("./task-reference/entities/task-reference.entity");
const stack_holder_entity_1 = require("./stack-holder/entities/stack-holder.entity");
const sector_plan_entity_1 = require("./sector-plan/entities/sector-plan.entity");
const sector_goal_entity_1 = require("./sector-goal/entities/sector-goal.entity");
const attachment_entity_1 = require("./attachment/entities/attachment.entity");
const department_entity_1 = require("./department/entities/department.entity");
const component_entity_1 = require("./component/entities/component.entity");
const project_entity_1 = require("./project/entities/project.entity");
const sector_entity_1 = require("./sector/entities/sector.entity");
const task_entity_1 = require("./task/entities/task.entity");
const user_entity_1 = require("./user/entities/user.entity");
const role_entity_1 = require("./role/entities/role.entity");
const project_objective_entity_1 = require("./project-objective/entities/project-objective.entity");
const finance_entity_1 = require("./finance/entities/finance.entity");
exports.entities = [
    project_objective_entity_1.ProjectObjective,
    project_history_entity_1.ProjectHistory,
    task_reference_entity_1.TaskReference,
    stack_holder_entity_1.StackHolder,
    attachment_entity_1.Attachment,
    sector_plan_entity_1.SectorPlan,
    sector_goal_entity_1.SectorGoal,
    department_entity_1.Department,
    component_entity_1.Component,
    project_entity_1.Project,
    sector_entity_1.Sector,
    task_entity_1.Task,
    user_entity_1.User,
    role_entity_1.Role,
    finance_entity_1.Finance,
];
//# sourceMappingURL=entities.js.map