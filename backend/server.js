const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // или твой пароль
  database: "signup"
});

db.connect((err) => {
  if (err) console.log("❌ MYSQL CONNECT ERROR:", err);
  else console.log("✅ MYSQL CONNECTED");
});

// ✅ Регистрация
app.post('/signup', (req, res) => {
  const sql = "INSERT INTO login (Name, Email, Password, is_admin) VALUES (?, ?, ?, false)";
  const values = [req.body.name, req.body.email, req.body.password];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json("DB error");
    res.status(200).json("Success");
  });
});

// ✅ Логин
app.post('/login', (req, res) => {
  const sql = "SELECT * FROM login WHERE Email = ? AND Password = ?";
  const values = [req.body.email, req.body.password];

  db.query(sql, values, (err, data) => {
    if (err) return res.status(500).json("Error");

    if (data.length > 0) {
      return res.status(200).json({
        message: "Success",
        name: data[0].Name,
        id: data[0].ID,
        is_admin: data[0].is_admin === 1
      });
    } else {
      return res.status(401).json("Invalid credentials");
    }
  });
});

// ✅ Добавить продукт
app.post('/add-product', (req, res) => {
  const { user_id, category, my_price, quantity, market_price } = req.body;
  if (!user_id || !category) return res.status(400).json("Missing data");

  const sql = `
    INSERT INTO products (user_id, category, my_price, quantity, market_price)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [user_id, category, my_price, quantity, market_price];
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json("Insert failed");
    res.status(200).json("Product added");
  });
});

// ✅ Обновить продукт
app.put('/update-product/:id', (req, res) => {
  const { category, my_price, quantity, market_price } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE products
    SET category = ?, my_price = ?, quantity = ?, market_price = ?
    WHERE id = ?
  `;
  const values = [category, my_price, quantity, market_price, id];
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json("Update failed");
    res.status(200).json("Product updated");
  });
});

// ✅ Удалить продукт
app.delete('/delete-product/:id', (req, res) => {
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json("Delete failed");
    res.status(200).json("Product deleted");
  });
});

// ✅ Получить продукты пользователя
app.get('/my-products/:userId', (req, res) => {
  const sql = "SELECT * FROM products WHERE user_id = ?";
  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(results);
  });
});

// ✅ Получить все продукты (для админа)
app.get('/all-products', (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(results);
  });
});

// ✅ Добавить категорию (админ)
app.post('/add-category', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json("Missing name");

  db.query("INSERT INTO categories (name) VALUES (?)", [name], (err) => {
    if (err) return res.status(500).json("Insert failed");
    res.status(200).json("Category added");
  });
});

// ✅ Получить все категории
app.get('/categories', (req, res) => {
  db.query("SELECT * FROM categories", (err, rows) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(rows);
  });
});

app.listen(8081, () => {
  console.log("🚀 Server listening on port 8081");
});

// ✅ Получить все продукты с именами пользователей
app.get('/all-products-with-users', (req, res) => {
  const sql = `
    SELECT products.*, login.Name as username
    FROM products
    JOIN login ON products.user_id = login.ID
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json("Error");
    res.status(200).json(results);
  });
});
