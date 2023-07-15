import { Router } from 'express';
import ProductManager from '../manager/product.manager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const products = await productManager.list();
  res.render('products', { products });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.list();
  res.render('products_realtime', { products });
});

router.get('/form-products', async (req, res) => {
  res.render('form', {});
});

router.post('/form-products', async (req, res) => {
  const data = req.body;
  await productManager.create(data);
  const products = await productManager.list();
  io.emit('reload-table', products);
  res.redirect('/');
});

export default router;
