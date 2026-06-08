import { forwardRef } from "react";

/** Nama field honeypot — selaras dengan server/security.ts honeypot middleware */
export const RESERVATION_HONEYPOT_FIELD = "website";

export const ReservationHoneypot = forwardRef<HTMLInputElement>(
  function ReservationHoneypot(_props, ref) {
    return (
      <input
        ref={ref}
        type="text"
        name={RESERVATION_HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px overflow-hidden opacity-0"
        defaultValue=""
      />
    );
  },
);
