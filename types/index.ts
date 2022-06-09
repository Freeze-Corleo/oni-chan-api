import { NextFunction, Request, Response } from 'express';

export interface CRUDInterface {
    getAll($req: Request, $res: Response, $next: NextFunction): Promise<void>;

    getOne($req: Request, $res: Response, $next: NextFunction): Promise<void>;

    create($req: Request, $res: Response, $next: NextFunction): Promise<void>;

    update($req: Request, $res: Response, $next: NextFunction): Promise<void>;

    delete($req: Request, $res: Response, $next: NextFunction): Promise<void>;
}

export abstract class CRUDController {
    public static getAll: CRUDInterface['getAll'];
    public static getOne: CRUDInterface['getOne'];
    public static create: CRUDInterface['create'];
    public static update: CRUDInterface['update'];
    public static delete: CRUDInterface['delete'];
}

export class ApiError extends Error {
    public status: number;
    public message: string;

    constructor({ status, message }: { status: number; message: string }) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
