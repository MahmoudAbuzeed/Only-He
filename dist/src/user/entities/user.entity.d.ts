import { Order } from "src/order/entities/order.entity";
export declare class User {
    id: number;
    first_name: string;
    last_name: string;
    user_name: string;
    token: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    orders: Order[];
}
