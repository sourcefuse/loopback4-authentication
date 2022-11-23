import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class UserCred extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  constructor(data?: Partial<UserCred>) {
    super(data);
  }
}

export interface UserCredRelations {
  // describe navigational properties here
}

export type AuthuserWithRelations = UserCred & UserCredRelations;
