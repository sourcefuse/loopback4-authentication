import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Authuser extends Entity {
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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Authuser>) {
    super(data);
  }
}

export interface AuthuserRelations {
  // describe navigational properties here
}

export type AuthuserWithRelations = Authuser & AuthuserRelations;
