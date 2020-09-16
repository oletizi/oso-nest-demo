import { Injectable } from '@nestjs/common';
import { Oso } from 'oso';
import { OsoConfig } from './oso-config';

/**
 * A Nest-ish service wrapper around the oso library. It's most important job is to initialize oso properly.
 */
@Injectable()
export class AuthorizationService {
  private readonly init: Promise<void[]>;

  /**
   * AuthorizationService constructor initializes the Oso instance based on the OsoConfig
   * @param config - the configuration for what classes and constants to register and Polar files to load
   * @param oso - an Oso instance to determine authorization based on the Polar rules
   */
  constructor(private readonly config: OsoConfig, private readonly oso: Oso) {
    config.classes().map((cls) => oso.registerClass(cls));
    config.constants().map((key, value) => oso.registerConstant(key, value));
    this.init = Promise.all(config.files().map(filename => oso.loadFile(filename)));
  }

  /**
   * Returns a promise that either: a) resolves when all of the Polar files have been loaded; or b) rejects if
   * *any* of the Polar files failed to load.
   */
  initialized(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.init.then(() => resolve()).catch(err => reject(err));
    });
  }

  /**
   * Passes the request for authorization back to the Oso instance.
   * @param actor
   * @param action
   * @param resource
   */
  async isAllowed(actor, action, resource): Promise<boolean> {
    await this.initialized(); // ensure all the Polar files are properly loaded before proceeding
    return this.oso.isAllowed(actor, action, resource);
  }
}