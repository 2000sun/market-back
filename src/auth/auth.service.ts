import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from 'src/domain/auth.entity';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { User } from 'src/domain/user.entity';
import { JwtService } from '@nestjs/jwt';




@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ){}





  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async generateDB(address: string) {
    
    const auth = new Auth();
    auth.address = address;
    auth.nonce = v4();
    auth.expiredAt =   new Date(new Date().getTime() + 10 * 60 * 1000); // 현재시간으로 부터 10분뒤 만료
    return await this.authRepository.save(auth);
  }

  generateSignMessage(auth : Auth) {
    return `Welcome to ChannelIN! \n 지갑 주소 :  ${auth.address}\n 논스 : ${auth.nonce}`;
  }

  async verifiedAuthRequest(id: number, signature: string) {
    const authRequest = await this.authRepository.findOne({where : {id, verified: false}});

    if(!authRequest) {
      throw new HttpException('auth 찾을 수 없음', HttpStatus.BAD_REQUEST);
    }

    if(authRequest.expiredAt && authRequest.expiredAt.getTime() < new Date().getDate()) {
      throw new HttpException('서명 만료됨',HttpStatus.BAD_REQUEST);
    }

   const recoverAddr =  ethers.verifyMessage(this.generateSignMessage(authRequest),signature);



   if(recoverAddr.replace('0x','').toLowerCase() !== authRequest.address.toLowerCase()) {
    throw new HttpException('지갑 주소가 다름',HttpStatus.UNAUTHORIZED);
   }


   authRequest.verified = true;

   await this.authRepository.save(authRequest);


   let user = await this. userRepository.findOne({where : {address : authRequest.address}});


   if (!user) {
    user = new User()
    user.address = authRequest.address;
    user = await this.userRepository.save(user);

   }


   return { accessToken : " "}

  //  this.jwtService.sign({
  //   sub : user.id,
  //   address : user.address
  // })

  }
 

  async findAll() {
    return await this.authRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }


  async remove(id: number) {
    const addr = await this.authRepository.findOne({where : {id}});

    if(!addr) {
      throw new Error('auth 찾을 수 없음.');
    }

    return await this.authRepository.remove(addr)
  }


}
