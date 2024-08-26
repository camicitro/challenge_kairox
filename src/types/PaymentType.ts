import { CHAR } from "@sequelize/core/lib/abstract-dialect/data-types"
import { UUID } from "crypto"

export type PaymentType = {
    totalAmount: number,
    referenceYear: number,
    referenceMonth: number
    affiliateId: string 
  }