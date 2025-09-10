"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_controller_1 = require("./modules/store/store.controller");
const router = (0, express_1.Router)();
// Store routes
const storeController = new store_controller_1.StoreController();
router.get('/api/stores/nearby', (req, res, next) => storeController.getNearbyStores(req, res, next));
router.get('/api/stores/search', (req, res, next) => storeController.searchStores(req, res, next));
router.get('/api/stores/:id', (req, res, next) => storeController.getStoreDetail(req, res, next));
// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.default = router;
//# sourceMappingURL=routes.js.map