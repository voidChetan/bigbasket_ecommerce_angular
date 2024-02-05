export const Constant = {
    API_END_POINT:'https://freeapi.gerasim.in/api/BigBasket/',
    METHODS: {
        GET_ALL_PRODUCT: 'GetAllProducts',
        GET_ALL_CATEGORY: 'GetAllCategory',
        GET_ALL_PRODUCT_BY_CATEGORY: 'GetAllProductsByCategoryId?id=',

        CREATE_PRODUCT: 'CreateProduct',
        UPDATE_PRODUCT: 'UpdateProduct',
        DELETE_PRODUCT: 'DeleteProductById?id=',
        ADD_TO_CART: 'ADDTOCART',
        GET_CART_BY_CUST: 'GetCartProductsByCustomerId?id=',
        REMOVE_CART: 'DeleteProductFromCartById?ID=',
    }
}