import { UserSelectDtoRoleEnum } from './api.types';
import { Feature } from './features.types';

export type User = {
  id: string;
  email: string;
  features: Feature[];
  firstName?: string;
  groupCode: string;
  lastName?: string;
  role?: UserSelectDtoRoleEnum;
};
