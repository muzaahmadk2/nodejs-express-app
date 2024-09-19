const { where } = require("sequelize");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      ////createProduct is a assosciation methode provided by the sequelize where Product is the name of our Product
      title: title, ///// table and we added create at the front.
      imageUrl: imageUrl,
      price: price,
      description: description,
    })

    .then((result) => {
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } }) ////getProducts is a association methode whioch sequelize gives us to fasten the work
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
    .then((pdt) => {
      pdt.title = updatedTitle;
      pdt.price = updatedPrice;
      pdt.imageUrl = updatedImageUrl;
      pdt.description = updatedDesc;
      return pdt.save();
    })
    .then((result) => {
      console.log("Product updated");
      res.redirect("/admin/products");
    })
    .catch((errr) => console.log(errr));
};

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      console.log("Product delketed");
      product.destroy();
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
