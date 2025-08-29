import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.get('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export { router as routes };