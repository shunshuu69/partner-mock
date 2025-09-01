import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { TrxRepository } from 'src/database/pg/repository/trx/repository';
import { TransactionRow } from 'src/database/pg/repository/trx/types';

@Injectable()
export class TriggerCallbackService {
  private readonly BASE_URL =
    process.env.PARTNER_CALLBACK_URL ?? 'http://localhost:3000';
  constructor(private readonly trxRepo: TrxRepository) {}

  async triggerAll(body?: { count?: number; payload?: unknown }) {
    const count = Math.max(1, Math.min(10000, Number(body?.count ?? 1)));
    // const basePayload = (body?.payload as Record<string, unknown>) ?? {
    //   ping: 'pong',
    // };

    // Fetch transactions from public.transaction (limit by count)
    const trxList: TransactionRow[] = await this.trxRepo.findMany(count);

    const trxPromises = trxList.map((trx) =>
      this.getPayloadVendor(trx.vendor_id, trx),
    );

    await Promise.all(trxPromises);

    return { queued: trxList.length };
  }

  async triggerOne() {
    // const basePayload = (body?.payload as Record<string, unknown>) ?? {
    //   ping: 'pong',
    // };

    // Fetch transactions from public.transaction (limit by count)
    const trxList: TransactionRow[] = await this.trxRepo.findOne(1);

    await this.getPayloadVendor(trxList[0].vendor_id, trxList[0]);

    return { queued: trxList.length };
  }

  async getPayloadVendor(vendor: string, trx: TransactionRow) {
    try {
      switch (vendor) {
        case 'fripay': {
          const payload = {
            amount: trx.amount,
            response_code: '00',
            serialnumber: 'ONEIQR0000000200',
            response_desc: 'APPROVE/SUCCESS',
            signature:
              'a13e191193469f54734c6534fc5edc04df4810cd5abc95fe5c405d9dd7941ea2',
            qris_id: trx.id,
            type: 'pay',
            payment_reff: 838,
            va_code: 'QRIS',
            partner_reff: trx.id,
            rrn: '152503',
            partner_reff2: trx.id,
            additionalfee: 861,
            balance: 3937546492,
            credit_balance: 122262,
            transaction_time: '2025-09-01 13:17:59',
            customer_name: 'FATIH Fripay QRIS',
            issuer_bank: '-',
            username: 'ONE8058JUB',
            status: 'SUCCESS',
          };

          await axios.post(`${this.BASE_URL}/api/callback/fripay`, payload, {
            headers: {
              'client-id': '0dd0f18e-cfc8-4fd8-bbbd-8abeb2af972a',
              'client-secret': 'tcsHGTlPPAtOKLv0CnlAfZN2V',
            },
          });
          break;
        }
        case 'e2pay': {
          const payload = {
            nbcb: '1',
            skey: '612e2af38246ecfd1d502d382b59e84d',
            amount: trx.amount,
            domain: trx.vendor_merchant_name,
            extraP: '{"RRN":"895558416438"}',
            status: '00',
            tranID: '220332608',
            appcode: '',
            channel: 'E2PAY_MBAYAR_QR',
            orderid: trx.id,
            paydate: '2025-09-01 14:52:04',
            currency: 'IDR',
            error_code: '',
            error_desc: '',
          };

          await axios.post(`${this.BASE_URL}/api/callback/e2pay`, payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          break;
        }
        case 'netzme': {
          const payload = {
            amount: {
              value: trx.amount,
              currency: 'IDR',
            },
            feeAmount: {
              value: '1050.00',
              currency: 'IDR',
            },
            netAmount: {
              value: trx.amount,
              currency: 'IDR',
            },
            splitFees: [],
            isSplitfee: false,
            additionalInfo: {
              rrn: '509012031065',
              issuerId: '93600008',
              qrDetail: {
                amount: 'IDR 150000.00',
                issuerId: '93600008',
                netAmount: 'IDR 148950.00',
                issuerName: 'Mandiri',
                terminalId: 'A01',
                buyerUserId: '9360000812114948513',
                customerPan: '9360000812114948513',
                merchantFee: 'IDR 1050.00',
                merchantPan: '9360081401001232405',
                referenceId: '5090120310652025090193600008',
                acquirerName: 'Netzme',
                merchantName: 'The Gauntlet Web',
                buyerFullname: 'MARSIKUN',
                transactionId: '25090114563739520429',
                merchantLocation: 'JAKARTA PUSAT',
                localTransactionDate: '20250901',
              },
              invoiceId: 'NETZ-INV-M_MRB1aIiz1756713352492TLH',
              paymentTime: '2025-09-01T14:56:18.108+07:00',
              paymentMethod: 'QRIS',
              custIdMerchant: trx.vendor_merchant_name,
              localTrasactionDate: 20250901,
            },
            originalReferenceNo: '39dd83889a3349acafba73bcc1cb62a6',
            transactionStatusDesc: 'Success',
            latestTransactionStatus: '00',
            originalPartnerReferenceNo: trx.id,
          };

          await axios.post(`${this.BASE_URL}/api/callback/netzme`, payload, {
            headers: {
              'Content-Type': 'application/json',
              'x-callback-token':
                'y4ZAzPVDxtFuGI12VsPerforDADX5YSdujuiR66Jhqc=',
            },
          });
          break;
        }
        default:
          throw new InternalServerErrorException('vendor not found');
      }
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.message ?? 'Internal Server Error',
      );
    }
  }

  async test() {
    const partnerBaseUrl =
      process.env.PARTNER_BASE_URL ?? 'http://localhost:4011';
    await axios.post(partnerBaseUrl + '/partner-callback/test', {
      ping: 'pong',
    });
    return 'test';
  }
}
