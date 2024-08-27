import { CHAR } from "@sequelize/core/lib/abstract-dialect/data-types"
import { UUID } from "crypto"
import { PaymentStatus } from "./PaymentStateEnum"

export type PaymentType = {
    totalAmount: number | null,
    paymentStatus: PaymentStatus,
    referenceYear: number,
    referenceMonth: number
    affiliateId: string 
  }

