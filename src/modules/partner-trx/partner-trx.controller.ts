import { Body, Controller, Post } from '@nestjs/common';
// import { PartnerTrxService } from './partner-trx.service';

@Controller('partner-trx')
export class PartnerTrxController {
  constructor() {}

  @Post()
  create(@Body() body: any) {
    // return this.partnerTrxService.create(body);
  }
}
