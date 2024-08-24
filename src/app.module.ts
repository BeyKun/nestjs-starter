import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './utils/database/database.module';
import { DomainModule } from './domain/domain.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { LoggerModule } from './utils/logger/logger.module';
import { AuthModule } from './auth/auth.module';
import { HelperModule } from './utils/helper/helper.module';
import { ConfigModule } from '@nestjs/config';
import { AssignmentsModule } from './assignments/assignments.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ModulesModule } from './modules/modules.module';
import { RolesModule } from './roles/roles.module';
import { RoleSettingsModule } from './role-settings/role-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    LoggerModule,
    AuthModule,
    HelperModule,
    UsersModule,
    DatabaseModule,
    DomainModule,
    AssignmentsModule,
    ModulesModule,
    RolesModule,
    RoleSettingsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
