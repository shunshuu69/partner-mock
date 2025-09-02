// import { Injectable } from '@nestjs/common';
// import { PartnerTrxRepository } from 'src/database/pg/repository/partner-trx/repository';
// import { randomUUID } from 'crypto';
// import { TrxRepository } from 'src/database/pg/repository/trx/repository';
// import { MerchantRepository } from 'src/database/pg/repository/merchant/repository';
// import { format } from 'date-fns';

// @Injectable()
// export class PartnerTrxService {
//   constructor(
//     private readonly partnerTrxRepository: PartnerTrxRepository,
//     private readonly trxRepository: TrxRepository,
//     private readonly merchantRepository: MerchantRepository,
//   ) {}
//   async create(body: any) {
//     // create a loop to create 1000 partner trx
//     const merchant = await this.merchantRepository.findOne(
//       body?.merchantId ?? 'A001',
//     );

//     if (!merchant) {
//       throw new Error('Merchant not found');
//     }

//     const count = Math.max(1, Math.min(10000, Number(body?.count ?? 1000)));
//     for (let i = 0; i < count; i++) {
//       const partnerTrxId = randomUUID();
//       const partnerId = merchant.partner_id;
//       const merchantId = merchant.id;
//       const amount = Math.floor(Math.random() * 1000000);
//       const amountCurrency = 'IDR';

//       function generateId(partnerId: string, merchantId: string): string {
//         const now = new Date();

//         // Generate a guaranteed 3-character alphanumeric string
//         const chars =
//           'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//         let randomString = '';
//         for (let i = 0; i < 3; i++) {
//           randomString += chars.charAt(
//             Math.floor(Math.random() * chars.length),
//           );
//         }

//         const formattedTimestamp = format(now, 'yyyyMMddHHmmssSSS'); // Timestamp with milliseconds
//         return `${partnerId}${merchantId}${formattedTimestamp}${randomString}`;
//       }

//       await this.partnerTrxRepository.createOne({
//         id: partnerTrxId,
//         partner_id: partnerId,
//         merchant_id: merchantId,
//         amount: amount,
//         amount_currency: amountCurrency,
//       });

//       const vendorAcc = body?.vendorInfoArr;

//       const randomVendor =
//         vendorAcc[Math.floor(Math.random() * vendorAcc.length)];

//       await this.trxRepository.createOne({
//         id: generateId(partnerId, merchantId),
//         pay_method: 'QRIS',
//         pay_vendor: randomVendor.vendor,
//         partner_id: partnerId,
//         merchant_id: merchantId,
//         amount: amount,
//         amount_currency: amountCurrency,
//         partner_refference: partnerTrxId,
//         additional_info: {},
//         created_at: new Date().toISOString(),
//         vendor_merchant_name: randomVendor.vendor_merchant_name,
//         vendor_account_id: randomVendor.account_id,
//         vendor_id: randomVendor.vendor,
//       });
//     }
//     return 'This action adds a new partnerTrx';
//   }
// }
