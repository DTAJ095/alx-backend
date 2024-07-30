// In stock?
import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

const app = express();
const PORT = 1245;
const HOST = 'localhost';
const redisClient = createClient();


const listProducts = [
  { id: 1, name: 'suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'suitcase 1050', price: 550, stock: 5 }
];

redisClient.on('connect', () => {
  console.log('Redis client connected to the server');
});
redisClient.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
  redisClient.quit();
});

/**
 * find item by id
 * @param {int} id
 * @returns item by id
 */
function getItemById (id) {
  return listProducts.find(item => item.id === id);
}

/**
 * reserve a stock
 * @param {int} itemId
 * @returns
 */
function reserveStockById (itemId, stock) {
  redisClient.set(`item.${itemId}`, stock);
}

/**
 * get current stock
 * @param {int} itemId
 * @returns the reserved stock for a specific item
 */
async function getCurrentReservedStockById (itemId) {
  const getAsync = promisify(redisClient.get).bind(redisClient);
  const stock = await getAsync(`item.${itemId}`);
  return stock;
}

app.get('/list_products', (_req, res) => {
  res.send(listProducts.map(item => ({
    itemId: item.id,
    itemName: item.name,
    price: item.price,
    initialAvailableQuantity: item.stock
  })));
});

app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const item = getItemById(parseInt(itemId));
  if (!item) {
    return res.status(404).send({ status: 'Product not found' });
  } else {
    const reservedStock = await getCurrentReservedStockById(parseInt(itemId));
    return res.send({
      ItemId: item.id,
      itemName: item.name,
      price: item.price,
      initialAvailableQuantity: item.stock,
      currentQuantity: reservedStock === null ? item.stock : parseInt(reservedStock)
    });
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const item = getItemById(parseInt(itemId));
  if (!item) {
    return res.status(404).send({ status: 'Product not found' });
  } else {
    const currentStock = await getCurrentReservedStockById(parseInt(itemId));
    if (currentStock === 0) {
      return res.send({ status: 'Not enough stock available', ItemId: itemId });
    } else {
      reserveStockById(parseInt(itemId), parseInt(currentStock) - 1);
      return res.send({ status: 'Reservation confirmed', ItemId: itemId });
    }
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server is listening on http://${HOST}:${PORT}`);
});
