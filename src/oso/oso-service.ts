import { Injectable } from '@nestjs/common';
import { Oso } from 'oso';
import { Document } from '../document/entity/document';
import { OsoConfig } from './oso-config';

@Injectable()
export class OsoService {
  private readonly init: Promise<void[]>;

  constructor(private readonly config: OsoConfig, private readonly oso: Oso) {
    config.classes().map((cls) => oso.registerClass(cls));
    config.constants().map((key, value) => oso.registerConstant(key, value));
    this.init = Promise.all(config.files().map(filename => oso.loadFile(filename)));
  }

  async authorize(document: Document) {
    throw new Error('Implement Me');
  }

  initialized(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.init.then(() => resolve()).catch(err => reject(err));
    });
  }
}