import { Entity } from '@loopback/repository';
export declare class Authuser extends Entity {
    username: string;
    password: string;
    [prop: string]: any;
    constructor(data?: Partial<Authuser>);
}
export interface AuthuserRelations {
}
export declare type AuthuserWithRelations = Authuser & AuthuserRelations;
