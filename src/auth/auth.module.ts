import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/domain/auth.entity';
import { User } from 'src/domain/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtStrategy } from './jwt.strategy';



@Module({
  imports: [ConfigModule,
    TypeOrmModule.forFeature([Auth,User]),
   JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService : ConfigService) => ({
        secret : configService.get('JWT_SCERET'),
    }),
   })
  ],
  controllers: [AuthController],
  providers: [AuthService,jwtStrategy],
})
export class AuthModule {}
