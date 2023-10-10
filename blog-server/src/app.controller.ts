import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor() {}

  @Get('/health-check')
  @ApiOkResponse()
  healthCheck(): HttpStatus {
    return HttpStatus.OK;
  }
}
