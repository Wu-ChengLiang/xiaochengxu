"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const config_1 = require("./config");
const routes_1 = __importDefault(require("./routes"));
const error_1 = require("./common/middleware/error");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use(routes_1.default);
// Error handling
app.use(error_1.errorHandler);
// Database connection and server start
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connected successfully');
    app.listen(config_1.config.port, () => {
        console.log(`Server is running on port ${config_1.config.port}`);
        console.log(`Environment: ${config_1.config.nodeEnv}`);
    });
})
    .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=app.js.map