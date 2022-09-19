const catchAsync = require("../utils/catchAsync");
const ShopingCart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

exports.getAllCart = catchAsync(async (req, res) => {
  const products = await ShopingCart.find();

  res.status(200).json({
    status: "success",
    timeOfRequest: req.requestTime,
    results: products.length,
    data: {
      products,
    },
  });
});

exports.addProductToShoppingCart = catchAsync(async(req, res) => {


  let usuario_autenticado = req.user;
  let request = req.body;
  const carritos = await ShopingCart.find({
      status: "PENDING"
  });


  if (carritos.length > 0) {
      let dats_primer_carrito = carritos[0];
      let id_carrito = dats_primer_carrito.id;
      let productos_carrito = dats_primer_carrito.products;

      let id_producto_add = request.id_producto;

      let dats_producto = await Product.findById(id_producto_add);

      if (dats_producto) {

          //VERIFICAR SI EL PRODUCTO YA ESTA EL CARRITO DE COMPRAS

          flag_existencia_producto = productos_carrito.findIndex(e => e.id_producto == id_producto_add);
          if (flag_existencia_producto == -1) { //SI NO EXISTE EL PRODUCT IN CART
              let nuevo_producto_carrito = {
                  id_producto: dats_producto.id,
                  precio_venta: request.precio_venta,
                  cantidad: request.cantidad,
              };

              productos_carrito.push(nuevo_producto_carrito);

              let carrito_actualizado = {
                  user: usuario_autenticado.userName,
                  status: 'PENDING',
                  products: productos_carrito
              }

              const update_carrito = await ShopingCart.findByIdAndUpdate(id_carrito, carrito_actualizado, { new: true });

              res.status(200).json({
                  status: "Product added successfully",
                  timeOfRequest: req.requestTime,
                  results: carritos.length,
                  data: {
                      update_carrito,
                  },
              });
          } else {


              productos_carrito.map(producto => {
                  if (producto.id_producto == id_producto_add) {
                      producto.cantidad = producto.cantidad + 1;
                  }
                  return producto;
              });


              let carrito_actualizado = {
                  user: usuario_autenticado.userName,
                  status: 'PENDING',
                  products: productos_carrito
              }

              const update_carrito = await ShopingCart.findByIdAndUpdate(id_carrito, carrito_actualizado, { new: true });

              res.status(200).json({
                  status: "The product was already added, the quantity was increased plus 1",
                  timeOfRequest: req.requestTime,
                  results: carritos.length,
                  data: {
                      update_carrito,
                  },
              });

          }


      } else {
          res.status(200).json({
              status: "Error the product id does not exist",
              timeOfRequest: req.requestTime
          });
      }
  } else {
      //CREAR UN CARRITO DE COMPRAS

      let id_producto_add = request.id_producto;

      let dats_producto = await Product.findById(id_producto_add);
      if (dats_producto) {
          let nuevo_carrito = {
              user: usuario_autenticado.userName,
              status: 'PENDING',
              products: [{
                  id_producto: dats_producto.id,
                  precio_venta: request.precio_venta,
                  cantidad: request.cantidad
              }]
          }

          const newCarrito = await ShopingCart.create(nuevo_carrito);

          res.status(200).json({
              status: "Cart successfully created and product added",
              timeOfRequest: req.requestTime,
              results: carritos.length,
              data: {
                  newCarrito,
              },
          });
      } else {
          res.status(200).json({
              status: "Error the product id does not exist",
              timeOfRequest: req.requestTime
          });
      }


  }
});

exports.deleteShoppingCart = catchAsync(async(req, res) => {

  let usuario_autenticado = req.user;

  const carritos = await ShopingCart.find({
      status: "PENDING"
  });

  if (carritos.length > 0) {
      let dats_primer_carrito = carritos[0];
      let id_carrito = dats_primer_carrito.id;
      let id_producto_delete = req.params.id;

      const productos_carrito = dats_primer_carrito.products;

      let posicion_producto_delete = productos_carrito.findIndex(producto => producto.id_producto == id_producto_delete);

      if (posicion_producto_delete >= 0) {
          productos_carrito.splice(posicion_producto_delete, 1);

          let carrito_actualizado = {
              user: usuario_autenticado.userName,
              status: 'PENDING',
              products: productos_carrito
          };

          const update_carrito = await ShopingCart.findByIdAndUpdate(id_carrito, carrito_actualizado, { new: true });

          res.status(200).json({
              status: "The product was removed from the cart",
              timeOfRequest: req.requestTime,
              results: carritos.length,
              data: {
                  update_carrito,
              },
          });

      } else {
          res.status(400).json({
              status: "The product does not exist in the cart",
              timeOfRequest: req.requestTime,
          });
      }
  } else {
      res.status(400).json({
          status: "There are no carts with pending status",
          timeOfRequest: req.requestTime,
      });
  }


});



exports.payShoppingCart = catchAsync(async(req, res) => {

  let usuario_autenticado = req.user;

  const carritos = await ShopingCart.find({
      status: "PENDING"
  });

  if (carritos.length > 0) {
      let dats_primer_carrito = carritos[0];
      let id_carrito = dats_primer_carrito.id;

      const productos_carrito = dats_primer_carrito.products;

      if (productos_carrito.length > 0) {

          let carrito_actualizado = {
              user: usuario_autenticado.userName,
              status: 'PAID',
              products: productos_carrito
          }

          const update_carrito = await ShopingCart.findByIdAndUpdate(id_carrito, carrito_actualizado, { new: true });

          res.status(200).json({
              status: "Cart paid successfully",
              timeOfRequest: req.requestTime,
              results: carritos.length,
              data: {
                  update_carrito,
              },
          });


      } else {
          res.status(400).json({
              status: "The cart has no products loaded",
              timeOfRequest: req.requestTime,
          });
      }

  } else {
      res.status(400).json({
          status: "There are no carts with pending status",
          timeOfRequest: req.requestTime,
      });
  }


});