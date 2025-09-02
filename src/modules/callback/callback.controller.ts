import { Body, Controller, Post } from '@nestjs/common';

@Controller('callback')
export class CallbackController {
  constructor() {}

  @Post()
  enqueue(@Body() body: any) {
    // return this.callbackService.callback(body);

    return { status: 'queued' };
  }
}
