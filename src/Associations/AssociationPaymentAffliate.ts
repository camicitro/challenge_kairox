import Affiliate from "../models/AffiliateModel";
import Payment from "../models/PaymentModel";


Affiliate.hasMany(Payment, { foreignKey: 'affiliateId', as: 'payments' });
Payment.belongsTo(Affiliate, { foreignKey: 'affiliateId', as: 'affiliate' });

export { Affiliate, Payment };
