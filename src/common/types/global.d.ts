import { UUIDVersion } from 'class-validator';
import { Request } from 'express';

export type AllowNull<T> = T | null;
export type UserRequest = Request & {
  user: {
    sub: UUIDVersion;
    username: string;
  };
};
export type MailProperty = {
  subject?: string;
  to?: string;
  text?: string;
  template?: string;
};
