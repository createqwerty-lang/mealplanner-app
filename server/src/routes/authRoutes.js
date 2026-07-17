import { Router } from 'express';
import { login, logout, me, refresh, register, requestPasswordReset, resetPassword, updateProfile } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);
router.put('/profile', authenticate, authorize('ADMIN'), updateProfile);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
