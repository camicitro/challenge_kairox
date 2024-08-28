import { PaymentStatus } from "./PaymentStateEnum"

export type PaymentType = {
    totalAmount: number | null,
    paymentStatus: PaymentStatus,
    referenceYear: number,
    referenceMonth: number
    affiliateId: string 
  }

