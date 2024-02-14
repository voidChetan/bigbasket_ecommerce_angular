export const Constant = {
  API_END_POINT: 'https://freeapi.gerasim.in/api/BigBasket/',
  API_END_POINT_USER: 'http://freeapi.gerasim.in/api/User/',
  METHODS: {
    GET_ALL_PRODUCT: 'GetAllProducts',
    GET_PRODUCT_BY_ID: 'GetProductById?id=',
    GET_ALL_CATEGORY: 'GetAllCategory',
    GET_ALL_PRODUCT_BY_CATEGORY: 'GetAllProductsByCategoryId?id=',
    CREATE_NEW_CATEGORY: 'CreateNewCategory',
    CREATE_PRODUCT: 'CreateProduct',
    UPDATE_PRODUCT: 'UpdateProduct',
    DELETE_PRODUCT: 'DeleteProductById?id=',
    ADD_TO_CART: 'ADDTOCART',
    GET_CART_BY_CUST: 'GetCartProductsByCustomerId?id=',
    REMOVE_CART: 'DeleteProductFromCartById?ID=',
    LOGIN: 'Login',
    USER_TOKEN_LOGIN: 'Login',
    REGISTER: 'RegisterCustomer',
    PLACE_ORDER: 'PlaceOrder',
    GET_ALL_OFFERS: 'GetAllOffers',
    CREATE_NEW_OFFER: 'CreateNewOffer',
    GET_CUSTOMER_BY_ID: 'GetCustomerById?id=',
    UPDATE_PROFILE: 'UpdateProfile',
    GET_ALL_SALE_BY_CUSTOMER_ID: 'GetAllSaleByCustomerId?id=',
    CANCEL_ORDER_BY_SALE_ID: 'cancelOrder?saleId=',
    OPEN_SALE_BY_SALE_ID: 'OpenSaleBySaleId?saleId='
  }
}
