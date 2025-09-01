CREATE TABLE
  public.partner_callback_log (
    id character varying(258) NOT NULL,
    merchant_id character varying(10) NULL,
    created_at timestamp with time zone NOT NULL,
    callback_url character varying(256) NULL,
    body_request character varying(1024) NULL,
    last_invoke_at timestamp with time zone NULL,
    last_body_response character varying(512) NULL,
    is_success boolean NULL,
    vendor_request jsonb NULL
  );
