import { Router } from 'express';
import { StoreController } from './modules/store/store.controller';

const router = Router();

// Store routes
const storeController = new StoreController();
router.get('/api/stores/nearby', (req, res, next) => storeController.getNearbyStores(req, res, next));
router.get('/api/stores/search', (req, res, next) => storeController.searchStores(req, res, next));
router.get('/api/stores/:id', (req, res, next) => storeController.getStoreDetail(req, res, next));

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;