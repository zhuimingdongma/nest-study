import {Injectable} from '@nestjs/common'
import { InferSubjects,Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability'
import { Action, Article, User } from './casl.interface'

type Subjects = InferSubjects<typeof User | typeof Article> | 'all'
export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityService {
  createUser(user: User) {
    const {can, cannot, build} = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>)
    if (user.isAdmin) {
      can(Action.Manage, 'all')
    }
    else {
      can(Action.Read, 'all')
    }
    
    can(Action.Update, Article, {authorId: user.id})
    cannot(Action.Delete, Article, {isPublished: true})
    
    return build({
      detectSubjectType(subject) {
        return subject.constructor as ExtractSubjectType<Subjects>
      },
    })
  }
}