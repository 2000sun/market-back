import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './orm.config';
import { CatsModule } from './cats/cats.module';
import { DogsModule } from './dogs/dogs.module';
import { ApplesunModule } from './applesun/applesun.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({useFactory: ormConfig}),
    CatsModule,
    DogsModule,
    ApplesunModule,
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
