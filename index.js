//npx sequelize-cli model:generate --name Order --attributes "used_id:integer, status:integer, note:text, total:integer"
//npx sequelize-cli model:generate --name Product --attributes "name:string, price:integer, oldprice:integer, image:text, description:text, specification:text, buyturn:integer, quantity:integer, brand_id:integer, category_id:integer"
//npx sequelize-cli model:generate --name OrderDetail --attributes "order_id:integer, product_id:integer, price:integer, quantity:integer"

//npx sequelize-cli model:generate --name Feedback --attributes "product_id:integer, user_id:integer, star:integer, content:text"
//npx sequelize-cli model:generate --name NewsDetail --attributes "product_id:integer, news_id:integer"
//npx sequelize-cli model:generate --name ProductImage --attributes "product_id:integer, img_url:text"
//npx sequelize-cli db:migrate
//npx sequelize-cli migration:generate --name add_session_to_orders
// const express = require('express')
//ALTER TABLE orders DROP FOREIGN KEY orders_ibfk_1;
//SELECT * FROM information_schema.table_constraints WHERE table_schema = 'shopapp' AND TABLE_NAME = 'orders'
//npx sequelize-cli model:generate --name Cart --attributes "session_id:string, user_id:integer"
//npx sequelize-cli model:generate --name CartItem --attributes "card_id:integer, product_id:integer, quantity:integer"
//ALTER TABLE orders MODIFY user_id INT NULL
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())
express.urlencoded({extended: true })
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
import { AppRouter } from './AppRouter'

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const port = process?.env?.PORT ?? 3000;
AppRouter(app)
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})