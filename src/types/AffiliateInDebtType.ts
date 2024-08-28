export type affiliatesInDebt = {
    affiliateName: string,
    affiliateDni: number,
    debts: { referenceYear: number, referenceMonth: number }[]
}