import { Body, Controller, Post } from '@nestjs/common';
import { TriggerCallbackService } from './trigger-callback.service';

@Controller('trigger-callback')
export class TriggerCallbackController {
  constructor(
    private readonly triggerCallbackService: TriggerCallbackService,
  ) {}

  @Post('all')
  triggerAll(@Body() body: { count?: number; payload?: unknown }) {
    return this.triggerCallbackService.triggerAll({ ...body });
  }

  @Post('one')
  triggerOne() {
    return this.triggerCallbackService.triggerOne();
  }

  @Post('test')
  test() {
    return 'test';
  }
}
