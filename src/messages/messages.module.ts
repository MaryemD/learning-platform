import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Session } from '../sessions/entities/session.entity';
import { UserEntity } from '../users/entities/user.entity';
import { MessagesController } from './messages.controller';
import { MessageResolver } from './graphql/resolvers/message.resolver';
import { MessagesGateway } from './messages.gateway';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UserService } from 'src/users/users.service';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Session, UserEntity]),
    ConfigModule,
    AnalyticsModule,
    SessionsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
      }),
    }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessageResolver, MessagesGateway, UserService],
  exports: [MessagesService, UserService],
})
export class MessagesModule {}
