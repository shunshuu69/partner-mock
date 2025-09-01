export type PartnerTransactionRow = {
  id: string;
  partner_id: string;
  merchant_id: string;
  amount: number;
  amount_currency: string;
  paid_at: string;
  is_paid: boolean;
  created_at: string;
};

export type PartnerTransactionInsertOne = Omit<
  PartnerTransactionRow,
  'paid_at' | 'is_paid' | 'created_at'
>;
