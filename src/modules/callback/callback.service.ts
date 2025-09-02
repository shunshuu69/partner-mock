import { Injectable, Logger } from '@nestjs/common';
// import { RabbitmqService } from 'src/messaging/rabbitmq.service';

@Injectable()
export class CallbackService {
  private readonly logger = new Logger(CallbackService.name);

  // constructor(private readonly rabbit: RabbitmqService) {}

  // callback(body: any) {
  //   const payload = {
  //     data: body ?? { ping: 'pong' },
  //     _meta: { attempt: 1 },
  //   };
  //   this.rabbit.publish(payload);
  //   return { status: 'queued' };
  // }

  // async processMessage(payload: any) {
  //   const baseUrl = process.env.PARTNER_BASE_URL ?? 'http://localhost:3000';
  //   const url = `${baseUrl}/partner-callback`;
  //   console.log('url : ', url);

  //   try {
  //     const res = await axios.post(url, payload?.data ?? payload, {
  //       timeout: 5000,
  //     });
  //     return res.data;
  //   } catch (e) {
  //     throw e as AxiosError;
  //   }
  // }
}
