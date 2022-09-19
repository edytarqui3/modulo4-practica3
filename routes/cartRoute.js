const express = require("express");

const shoppingCartController = require("./../controllers/shoppingCartController");
const authController = require("./../controllers/authController");
const shoppingCartRouter = express.Router();
//routes
shoppingCartRouter.all('/', authController.protect)
    .get('/', shoppingCartController.getAllCart);
//routes
shoppingCartRouter
    .route("/product")
    .all(authController.protect)
    .post(shoppingCartController.addProductToShoppingCart);

shoppingCartRouter
    .route("/product/:id")
    .all(authController.protect)
    .delete(shoppingCartController.deleteShoppingCart);

shoppingCartRouter
    .route("/pay")
    .all(authController.protect)
    .post(shoppingCartController.payShoppingCart);

module.exports = shoppingCartRouter;