import { AppAbility } from "./casl.service";

export class User {
  id: number;
  isAdmin: boolean;
}

export class Article {
  id: number;
  isPublished: boolean;
  authorId: number;
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

interface IPolicyHandler {
  handle(ability: AppAbility) : boolean
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback

export class ReadArticlePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Article)
  }
}