import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { apiKeyAuth } from '../../middleware/apiKeyAuth';
import * as ctrl from './contracts.controller';

const router = Router();

// Static route MUST come before /:id
router.get('/expiring-soon', apiKeyAuth, ctrl.getExpiringSoon);

router.get('/', authenticate, ctrl.listContracts);
router.post('/', authenticate, ctrl.createContract);
router.get('/:id', authenticate, ctrl.getContract);
router.put('/:id', authenticate, ctrl.updateContract);
router.delete('/:id', authenticate, ctrl.deleteContract);

export default router;
