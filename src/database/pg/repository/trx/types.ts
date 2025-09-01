export type TransactionRow = {
  id: string;
  pay_method: string;
  pay_vendor: string;
  partner_id: string;
  merchant_id: string;
  amount: number;
  amount_currency: string;
  partner_refference: string;
  vendor_merchant_id: number;
  additional_info: Record<string, any>;
  created_at: string;
  modified_at: string;
  paid_at: string;
  payment_refference: string;
  payment_merchant_id: string;
  payment_nett_amount: number;
  payment_vedor_fee: number;
  payment_info: Record<string, any>;
  is_paid: boolean;
  is_settled: boolean;
  settlement_id: string;
  settlement_amount: number;
  settlement_nett_amount: number;
  settlement_vendor_fee: number;
  create_req_id: string;
  payment_req_id: string;
  vendor_merchant_name: string | null;
  vendor_account_id: string;
  vendor_id: string;
  rrn: string;
  settled_at: string;
};

export type TransactionInsertOne = Pick<
  TransactionRow,
  | 'id'
  | 'pay_method'
  | 'pay_vendor'
  | 'partner_id'
  | 'merchant_id'
  | 'amount'
  | 'amount_currency'
  | 'partner_refference'
  | 'additional_info'
  | 'created_at'
  | 'vendor_merchant_name'
  | 'vendor_account_id'
  | 'vendor_id'
>;
