import { Body, Controller, Get, Post } from '@nestjs/common';
import { PartnerCallbackService } from './partner-callback.service';

@Controller('partner-callback')
export class PartnerCallbackController {
  constructor(
    private readonly partnerCallbackService: PartnerCallbackService,
  ) {}

  @Post('test')
  test() {
    return 'test ini apa sih';
  }

  @Post()
  async handle(@Body() body: any) {
    await this.partnerCallbackService.handle(body);
    return {
      status: 'success',
      message: 'Callback received',
    };
  }

  @Get('counter')
  async getCounter() {
    const counter = await this.partnerCallbackService.getCounter();
    return { counter };
  }
}
