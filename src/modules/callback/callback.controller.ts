import { Body, Controller, Post } from '@nestjs/common';
import { CallbackService } from './callback.service';

@Controller('callback')
export class CallbackController {
  constructor(private readonly callbackService: CallbackService) {}

  @Post()
  enqueue(@Body() body: any) {
    return this.callbackService.callback(body);
  }
}
