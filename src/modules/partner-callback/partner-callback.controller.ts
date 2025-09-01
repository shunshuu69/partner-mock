import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PartnerTrxRepository } from 'src/database/pg/repository/partner-trx/repository';

@Controller('partner-callback')
export class PartnerCallbackController {
  constructor(private readonly partnerTrxRepo: PartnerTrxRepository) {}

  @Post('test')
  test() {
    return 'test ini apa sih';
  }

  @Post()
  async handle(@Body() body: any) {
    if (body?.transactionStatusDesc !== 'Success') {
      throw new HttpException('Transaction failed', HttpStatus.BAD_REQUEST);
    }

    // Only update partner_transaction when payload contains partner_trx.id
    const partnerTrxId: unknown = body?.originalPartnerReferenceNo;
    if (typeof partnerTrxId === 'string' && partnerTrxId.length > 0) {
      await this.partnerTrxRepo.markPaid(partnerTrxId);
    }

    return {
      status: 'success',
      message: 'Callback received',
    };
  }
}
