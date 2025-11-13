//npx sequelize-cli model:generate --name Order --attributes "used_id:integer, status:integer, note:text, total:integer"
//npx sequelize-cli model:generate --name Product --attributes "name:string, price:integer, oldprice:integer, image:text, description:text, specification:text, buyturn:integer, quantity:integer, brand_id:integer, category_id:integer"
//npx sequelize-cli model:generate --name OrderDetail --attributes "order_id:integer, product_id:integer, price:integer, quantity:integer"

//npx sequelize-cli model:generate --name Feedback --attributes "product_id:integer, user_id:integer, star:integer, content:text"
//npx sequelize-cli model:generate --name NewsDetail --attributes "product_id:integer, news_id:integer"

// const express = require('express')
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())
express.urlencoded({extended: true })
import { AppRouter } from './AppRouter'

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const port = process?.env?.PORT ?? 3000;
AppRouter(app)
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})