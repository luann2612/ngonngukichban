import express from 'express'
const router = express.Router()
import * as UserController from './controllers/UserController.js'
import * as ProductController from './controllers/ProductController.js'
import * as CategoryController from './controllers/CategoryController.js'
import * as BrandController from './controllers/BrandController.js'
import * as OrderController from './controllers/OrderController.js'
import * as OrderDetailController from './controllers/OrderDetailController.js'
import * as NewsController from './controllers/NewsController.js'
import * as NewsDetailController from './controllers/NewsDetailController.js'
import * as BannerController from './controllers/BannerController.js'
import * as BannerDetailController from './controllers/BannerDetailController.js'
import * as ImageController from './controllers/ImageController.js'
import * as ProductImageController from './controllers/ProductImageController.js'
import * as CartController from './controllers/CartController.js'
import * as CartItemController from './controllers/CartItemController.js'


import asyncHandler from './middlewares/asyncHandler.js'
import validate from './middlewares/validate.js'
import InsertProductRequest from './dtos/requests/product/InsertProductRequest.js'
import UpdateProductRequest from './dtos/requests/product/UpdateProductRequest.js'
import InsertOrderRequest from './dtos/requests/order/InsertOderRequest.js'
import UpdateOrderRequest from './dtos/requests/order/UpdateOrderRequest.js'
import InsertUserRequest from './dtos/requests/users/InsertUserRequest.js'
import LoginUserRequest from './dtos/requests/users/LoginUserRequest.js'
import InsertNewsRequest from './dtos/requests/news/InsertNewsRequest.js' 
import InsertNewsDetailRequest from './dtos/requests/newsdetail/InsertNewsDetailRequest.js' 
import UpdateNewsRequest from './dtos/requests/news/UpdateNewsRequest.js'
import InsertBannerRequest from './dtos/requests/banner/InsertBannerRequest.js' 
import InsertBannerDetailRequest from './dtos/requests/bannerdetail/InsertBannerDetailRequest.js'
import uploadImageMiddleware from './middlewares/imageUpload.js'
import validateImageExists from './middlewares/validateImageExists.js'
import InsertProductImageRequest from './dtos/requests/product_images/IndertProductImageRequest.js'
import InsertCartRequest from './dtos/requests/cart/InsertCartRequest.js'
import InsertCartItemRequest from './dtos/requests/cart_item/InsertCartItemRequest.js'
export function AppRouter(app) {
    //User Router
    router.post('/users/register',
        validate(InsertUserRequest),
        asyncHandler(UserController.registerUser) 
    )
    router.post('/users/login', 
        validate(LoginUserRequest),
        asyncHandler(UserController.loginUser))


    //http:localhost:3000/products
    //Product Router
    router.get('/products', asyncHandler(ProductController.getProducts))
    router.get('/products/:id', asyncHandler(ProductController.getProductById))
    router.post('/products',
        validateImageExists,
        validate(InsertProductRequest),
        asyncHandler(ProductController.insertProduct)
    )
    router.put('/products/:id', 
        validateImageExists,
        validate(UpdateProductRequest),
        asyncHandler(ProductController.updateProduct))
    router.delete('/products/:id', asyncHandler(ProductController.deleteProduct))

    //Product Image Router
    router.get('/productImages', asyncHandler(ProductImageController.getProductImages))
    router.get('/productImages/:id', asyncHandler(ProductImageController.getProductImageById))
    router.post('/productImages', 
        validate(InsertProductImageRequest),
        asyncHandler(ProductImageController.insertProductImage))
    router.delete('/productImages/:id', asyncHandler(ProductImageController.deleteProductImage))

    //Category Router
    router.get('/categories', asyncHandler(CategoryController.getCategories))
    router.get('/categories/:id', asyncHandler(CategoryController.getCategoryById))
    router.post('/categories',
        validateImageExists,
         asyncHandler(CategoryController.insertCategory))
    router.put('/categories/:id',
        validateImageExists,
         asyncHandler(CategoryController.updateCategory))
    router.delete('/categories/:id', asyncHandler(CategoryController.deleteCategory))

    //Brand Router
    router.get('/brands', asyncHandler(BrandController.getBrands))
    router.get('/brands/:id', asyncHandler(BrandController.getBrandById))
    router.post('/brands',
        validateImageExists, 
        asyncHandler(BrandController.insertBrand))
    router.put('/brands/:id', 
        validateImageExists,
        asyncHandler(BrandController.updateBrand))
    router.delete('/brands/:id', asyncHandler(BrandController.deleteBrand))

    //Order Router
    router.get('/orders', asyncHandler(OrderController.getOrders))
    router.get('/orders/:id', asyncHandler(OrderController.getOrderById))
    // router.post('/orders', 
    //     validate(InsertOrderRequest),
    //     asyncHandler(OrderController.insertOrder))
    router.put('/orders/:id', 
        validate(UpdateOrderRequest),
        asyncHandler(OrderController.updateOrder))
    router.delete('/orders/:id', asyncHandler(OrderController.deleteOrder))

    //OrderDetail Router
    router.get('/orderDetails', asyncHandler(OrderDetailController.getOrderDetails))
    router.get('/orderDetails/:id', asyncHandler(OrderDetailController.getOrderDetailById))
    router.post('/orderDetails', asyncHandler(OrderDetailController.insertOrderDetail))
    router.put('/orderDetails/:id', asyncHandler(OrderDetailController.updateOrderDetail))
    router.delete('/orderDetails/:id', asyncHandler(OrderDetailController.deleteOrderDetail))

     //Cart Router
    router.get('/carts', asyncHandler(CartController.getCarts))
    router.get('/carts/:id', asyncHandler(CartController.getCartById))
    router.post('/carts', 
        validate(InsertCartRequest),
        asyncHandler(CartController.insertCart))
    router.post('/carts/checkout', asyncHandler(CartController.checkoutCart))
    //router.put('/carts/:id', asyncHandler(CartController.updateCart))
    router.delete('/carts/:id', asyncHandler(CartController.deleteCart))

    //CartItem Router
    router.get('/cartItems', asyncHandler(CartItemController.getCartItems))
    router.get('/cartItems/:id', asyncHandler(CartItemController.getCartItemById))
    router.get('/cartItems/carts/:cart_id', asyncHandler(CartItemController.getCartItemsByCartId))
    router.post('/cartItems', 
        validate(InsertCartItemRequest),
        asyncHandler(CartItemController.insertCartItem))
    router.put('/cartItems/:id', asyncHandler(CartItemController.updateCartItem))
    router.delete('/cartItems/:id', asyncHandler(CartItemController.deleteCartItem))

    //News Router
    router.get('/news', asyncHandler(NewsController.getNews));
    router.get('/news/:id', asyncHandler(NewsController.getNewsById));
    router.post('/news',
        validate(InsertNewsRequest),
        validateImageExists,
        asyncHandler(NewsController.insertNews));
    router.put('/news/:id', 
        validate(UpdateNewsRequest),
        validateImageExists,
        asyncHandler(NewsController.updateNews));
    router.delete('/news/:id', asyncHandler(NewsController.deleteNews));
    //NewsDetail Router
    router.get('/newsDetails', asyncHandler(NewsDetailController.getNewsDetails));
    router.get('/newsDetails/:id', asyncHandler(NewsDetailController.getNewsDetailById));
    router.post('/newsDetails',
        validate(InsertNewsDetailRequest),
        asyncHandler(NewsDetailController.insertNewsDetail));
    router.put('/newsDetails/:id', asyncHandler(NewsDetailController.updateNewsDetail));
    router.delete('/newsDetails/:id', asyncHandler(NewsDetailController.deleteNewsDetail));

    //Banner Router
    router.get('/banners', asyncHandler(BannerController.getBanners));
    router.get('/banners/:id', asyncHandler(BannerController.getBannerById));
    router.post('/banners', 
        validate(InsertBannerRequest),
        validateImageExists,
        asyncHandler(BannerController.insertBanner));
    router.put('/banners/:id', asyncHandler(BannerController.updateBanner));
    router.delete('/banners/:id', 
        validateImageExists,
        asyncHandler(BannerController.deleteBanner));

    //BannerDetail Router
    router.get('/bannerDetails', asyncHandler(BannerDetailController.getBannerDetails));
    router.get('/bannerDetails/:id', asyncHandler(BannerDetailController.getBannerDetailById));
    router.post('/bannerDetails', 
        validate(InsertBannerDetailRequest),
        asyncHandler(BannerDetailController.insertBannerDetail));
    router.put('/bannerDetails/:id', asyncHandler(BannerDetailController.updateBannerDetail));
    router.delete('/bannerDetails/:id', asyncHandler(BannerDetailController.deleteBannerDetail));

    //Image Upload Router
    router.post('/images/upload', 
        uploadImageMiddleware.array('images', 5),
        asyncHandler(ImageController.uploadImages  )
    )
    router.get('/images/:filename', asyncHandler(ImageController.viewImage))
    router.delete('/images/:filename', asyncHandler(ImageController.deleteImage))

    //Cart Router


    app.use('/api/',router)
    
}