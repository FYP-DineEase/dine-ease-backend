import { UserRoles } from '@dine_ease/common';

export interface User {
  id: string;
  email: string;
  name: string;
  slug: string;
  role: UserRoles;
  avatar?: string;
  location: object;
}
