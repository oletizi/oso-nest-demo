import { Map, Set } from 'immutable';
import { Actor } from '../users/entity/actor';
import { Document } from '../document/entity/document';
import { Guest } from '../users/entity/guest';
import { User } from '../users/entity/user';

export class OsoConfig {
  classes(): Set<any> {
    return Set([Actor, Guest, User, Document]);
  }

  constants(): Map<string, any> {
    return Map({console: console});
  }

  files(): Set<string> {
    return Set([`${__dirname}/root.polar`, `${__dirname}/policy.polar`]);
  }
}