import { Project } from 'src/project/entities/project.entity';
export declare class Finance {
    id: number;
    bank_name: string;
    account_number: number;
    first_withdrawal_date: Date;
    final_withdrawal_date: Date;
    account_activation_date: Date;
    general_information: string;
    created_at: Date;
    updated_at: Date;
    project: Project;
}
