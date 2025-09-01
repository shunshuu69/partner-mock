CREATE TABLE
  public.transaction (
    id character varying(255) NOT NULL,
    partner_id character varying(3) NOT NULL,
    merchant_id character varying(4) NOT NULL,
    amount numeric(15, 2) NULL,
    amount_currency character varying(3) NULL,
    partner_refference character varying(50) NOT NULL,
    paid_at timestamp with time zone NULL,
    is_paid boolean NULL DEFAULT false
  );