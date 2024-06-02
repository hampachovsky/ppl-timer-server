import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { TagsModule } from './tags/tags.module';
import { TasksModule } from './tasks/tasks.module';
import { TimerIntervalsModule } from './timer-intervals/timer-intervals.module';
import { TimersModule } from './timers/timers.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // host: configService.get('host'),
        // port: +configService.get<number>('DB_PORT'),
        // username: configService.get('DB_USERNAME'),
        // password: configService.get('DB_PASSWORD'),
        // database: configService.get('DB_NAME'),
        url: configService.get('DB_URL'),
        // autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    TimersModule,
    AuthModule,
    ProjectsModule,
    TagsModule,
    TasksModule,
    ClientsModule,
    TimerIntervalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
