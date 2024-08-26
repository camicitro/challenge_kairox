import Affiliate from "../models/AffiliateModel";
import Payment from "../models/PaymentModel";


export const defineAssociations = () => {
    
    Affiliate.hasMany(Payment, {
        sourceKey: 'Id',
        foreignKey: 'affiliateId',
        as: 'payments',
    });

    
    Payment.belongsTo(Affiliate, {
        foreignKey: 'affiliateId',
        as: 'affiliate',
    });
};

/*Affiliate.hasMany(Payment, { foreignKey: 'affiliateId', as: 'payments' });
Payment.belongsTo(Affiliate, { foreignKey: 'affiliateId', as: 'affiliate' });

export { Affiliate, Payment };*/
