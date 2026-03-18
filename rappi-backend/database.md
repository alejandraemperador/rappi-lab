# Database Schema

The following tables must be created in the DB before running the application.

## Users

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);
```

## Users SQL Queries

### getUsers

```sql
SELECT * FROM users;
```

### getUserById

```sql
SELECT * FROM users WHERE id = $1;
```

### authenticateUser

```sql
SELECT * FROM users WHERE email = $1 AND password = $2;
```

### createUser

```sql
INSERT INTO users (id, email, name, password, role)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
```

### updateUser

```sql
UPDATE users
SET name = $2
WHERE id = $1
RETURNING *;
```

### deleteUser

```sql
DELETE FROM users WHERE id = $1 RETURNING *;
```

### Stores
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    isopen BOOLEAN DEFAULT false,
    userid UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```
## Store SQL Queries

### getStores
```sql
SELECT * FROM stores WHERE isopen = true;
```
### getStoreById
```sql
SELECT * FROM stores WHERE id = $1;
```
### createStore
```sql
INSERT INTO stores (name, userid) VALUES ($1, $2) 
RETURNING *;
```
### updateStoreStatus
-- Para abrir o cerrar la tienda
```sql
UPDATE stores SET isopen = $1 WHERE id = $2 RETURNING *;
```

### Products
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    imageurl TEXT,
    storeid UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE
);
```
## Products SQL Queries

### getProductsByStore
-- Para que el consumidor vea el menú de una tienda
```sql
SELECT * FROM products WHERE storeid = $1;
```
### createProduct
-- Para que el administrador de la tienda cree productos
```sql
INSERT INTO products (name, description, price, imageurl, storeid)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
```
### deleteProduct
```sql
DELETE FROM products WHERE id = $1;
```

### Orders
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    consumerid UUID NOT NULL REFERENCES users(id),
    storeid UUID NOT NULL REFERENCES stores(id),
    deliveryid UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending',
    total INTEGER DEFAULT 0,
    createdat TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
## Orders SQL Queries

### createOrder
-- El consumidor crea la orden (paso 1)
```sql
INSERT INTO orders (consumerid, storeid, total)
VALUES ($1, $2, $3)
RETURNING *;
```
### getAvailableOrders
-- Para el repartidor: Ver órdenes pendientes que no tienen repartidor
```sql
SELECT * FROM orders WHERE status = 'pending' AND deliveryId IS NULL;
```
### acceptOrder
-- El repartidor acepta el pedido (paso 2)
```sql
UPDATE orders SET deliveryid = $2, status = 'accepted' WHERE id = $1 RETURNING *;
```
### updateOrderStatus
-- Para cambiar a 'ready', 'on_way' o 'delivered'
```sql
UPDATE orders SET status = $2 WHERE id= $1 RETURNING *;
```
### getUserOrders
```sql
SELECT * FROM orders WHERE consumerid = $1 OR deliveryId = $1 ORDER BY createdat DESC;
```

### Orders_items
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    orderid UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    productid UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    priceattime INTEGER NOT NULL
)
```
## Order_items SQL Queries

### createOrderItem
-- Se ejecuta por cada producto del carrito al crear la orden
```sql
INSERT INTO order_items (orderid, productid, quantity, priceattime)
VALUES ($1, $2, $3, $4);
```
### getOrderDetails
-- Para ver qué productos tiene una orden específica
```sql
SELECT oi.*, p.name
FROM order_items oi
JOIN products p ON oi.productid = p.id
WHERE oi.orderid = $1;
```