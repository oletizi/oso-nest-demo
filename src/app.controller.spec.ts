import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {OsoInstance} from "./oso/oso.guard";

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, OsoInstance],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it ('should have a login path', () => {
      expect(appController.login).toBeDefined()
    })
  })

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.getHello()).toBe('Hello World!');
  //   });
  // });
});
