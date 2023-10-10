import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as winston from 'winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeneralLogger } from './logger/general.logger';
import { ConfigService } from './config/config.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import dataSource from '@config/datasource.config';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
      dataSourceFactory: async () => {
        await dataSource.initialize();
        await dataSource.runMigrations();
        return dataSource;
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.graphQLConfig,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, GeneralLogger, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
