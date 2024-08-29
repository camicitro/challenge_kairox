"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./config/database/data.source");
const dotenv_1 = __importDefault(require("dotenv"));
const AffiliateRoutes_1 = __importDefault(require("./routes/AffiliateRoutes"));
require("./models/AffiliateModel");
const PaymentRoutes_1 = __importDefault(require("./routes/PaymentRoutes"));
const AssociationPaymentAffliate_1 = require("./Associations/AssociationPaymentAffliate");
const ProcessPaymentRoutes_1 = __importDefault(require("./routes/ProcessPaymentRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/api', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use('/api', PaymentRoutes_1.default);
app.use('/api', AffiliateRoutes_1.default);
app.use('/api', ProcessPaymentRoutes_1.default);
const startServer = async () => {
    try {
        await data_source_1.sequelize.authenticate();
        console.log('Conexión a la BD exitosa');
        (0, AssociationPaymentAffliate_1.defineAssociations)();
        await data_source_1.sequelize.sync({ force: false, alter: false });
        app.listen(PORT, () => {
            console.log('API lista por el puerto', PORT);
        });
    }
    catch (error) {
        console.error('Error al conectar');
    }
};
startServer();
