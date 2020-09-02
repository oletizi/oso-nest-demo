import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {OsoGuard, OsoInstance} from './oso/oso.guard';
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import {DocumentService} from './document/document.service';
import {DocumentController} from './document/document.controller';
import {DocumentModule} from './document/document.module';
import {OsoModule} from './oso/oso.module';
import {BaseModule} from './base/base.module';
import {AuthService} from "./auth/auth.service";

@Module({
  imports: [AuthModule, UsersModule, DocumentModule, OsoModule, BaseModule],
  controllers: [AppController, DocumentController],
  providers: [AppService, DocumentService, OsoGuard, OsoInstance],
  exports: [],
})
export class AppModule {
}
