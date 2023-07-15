import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './manager/product.manager.js';
import __dirname from './utils.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const port = 8080;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

io.on('connection', (socket) => {
    socket.emit('connected');
  socket.on('new-product', async (data) => {
    const productManager = new ProductManager();
    await productManager.create(data);
    const products = await productManager.list();
    io.emit('reload-table', products);
    
  });
});
