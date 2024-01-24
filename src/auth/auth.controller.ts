import { Controller, Get, Post, Body, Patch, Param, Delete,HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verifySignMessage(@Body() body) {
   const {signature, id} = body;

   return  this.authService.verifiedAuthRequest(id,signature);
  } 
  


  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':address')
  async createSignMessage(@Param() param) {

    // 이더리움 40글자 주소가 맞는지 검증 
      if(!/^[0-9a-fA-F]{40}$/.test(param.address)) {
      throw new HttpException('잘못된 주소', HttpStatus.BAD_REQUEST);
    }

    // 유저 정보(주소,논스,만료기간) 객체 받기 
    const authRequest = await this.authService.generateDB(param.address);


    // 유저 ID , 서명 메세지 ,논스 , 만료기간을 리턴
     return {
       id : authRequest.id,
       message : this.authService.generateSignMessage(authRequest),
       expiredAt: authRequest.expiredAt,
     }
  }

  



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
