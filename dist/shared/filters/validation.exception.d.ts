import { BadRequestException } from '@nestjs/common';
interface Error {
    [key: string]: string;
}
export declare class ValidationException extends BadRequestException {
    validationErrors: Error;
    constructor(validationErrors: Error);
}
export {};
