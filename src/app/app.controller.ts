import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Root App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('public/assets/images/:imageName')
  invoke(@Req() req, @Res() res) {
    return res.sendFile(req.path, { root: './' });
  }
}
