import express from 'express'
const router = express.Router()
import * as ProductController from './controllers/ProductController'
import * as CategoryController from './controllers/CategoryController.js'
import * as BrandController from './controllers/BrandController.js'
import * as OrderController from './controllers/OrderController.js'
import * as OrderDetailController from './controllers/OrderDetailController.js'
import asyncHandler from './middlewares/asyncHandler.js'
import validate from './middlewares/validate.js'
import InsertProductRequest from './dtos/requests/product/InsertProductRequest.js'
import UpdateProductRequest from './dtos/requests/product/UpdateProductRequest.js'
export function AppRouter(app) {
    //http:localhost:3000/products
    //Product Router
    router.get('/products', asyncHandler(ProductController.getProducts))
    router.get('/products/:id', asyncHandler(ProductController.getProductById))
    router.post('/products',
        validate(InsertProductRequest),
        asyncHandler(ProductController.insertProduct)
    )
    router.put('/products/:id', 
        validate(UpdateProductRequest),
        asyncHandler(ProductController.updateProduct))
    router.delete('/products/:id', asyncHandler(ProductController.deleteProduct))

    //Category Router
    router.get('/categories', asyncHandler(CategoryController.getCategories))
    router.get('/categories/:id', asyncHandler(CategoryController.getCategoryById))
    router.post('/categories', asyncHandler(CategoryController.insertCategory))
    router.put('/categories/:id', asyncHandler(CategoryController.updateCategory))
    router.delete('/categories/:id', asyncHandler(CategoryController.deleteCategory))

    //Brand Router
    router.get('/brands', asyncHandler(BrandController.getBrands))
    router.get('/brands/:id', asyncHandler(BrandController.getBrandById))
    router.post('/brands', asyncHandler(BrandController.insertBrand))
    router.put('/brands/:id', asyncHandler(BrandController.updateBrand))
    router.delete('/brands/:id', asyncHandler(BrandController.deleteBrand))

    //Order Router
    router.get('/orders', asyncHandler(OrderController.getOrders))
    router.get('/orders/:id', asyncHandler(OrderController.getOrderById))
    router.post('/orders', asyncHandler(OrderController.insertOrder))
    router.put('/orders/:id', asyncHandler(OrderController.updateOrder))
    router.delete('/orders/:id', asyncHandler(OrderController.deleteOrder))

    //OrderDetail Router
    router.get('/orderDetails', asyncHandler(OrderDetailController.getOrderDetails))
    router.get('/orderDetails/:id', asyncHandler(OrderDetailController.getOrderDetailById))
    router.post('/orderDetails', asyncHandler(OrderDetailController.insertOrderDetail))
    router.put('/orderDetails/:id', asyncHandler(OrderDetailController.updateOrderDetail))
    router.delete('/orderDetails/:id', asyncHandler(OrderDetailController.deleteOrderDetail))
    app.use('/api/',router)
    
}