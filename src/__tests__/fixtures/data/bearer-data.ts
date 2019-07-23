import {IAuthUser} from '../../../types';

export const userWithoutReqObj: IAuthUser = {
  id: 1,
  username: 'xyz',
  password: 'pass',
};

export const userWhenReqObj: IAuthUser = {
  id: 2,
  username: 'abc',
  password: 'test',
};

export const validToken = 'validtoken';
