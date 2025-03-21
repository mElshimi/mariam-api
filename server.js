const jsonServer = require("json-server");
const multer = require("multer");
const auth = require("json-server-auth");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// const cors = require("cors");
// server.use(cors());
server.use(middlewares);
server.use(auth);
server.use(router);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    let date = new Date();
    let image = date.getTime() + "_" + file.originalname;
    req.body.image = image;
    cb(null, image);
  },
});

const bodyParser = multer({ storage: storage }).any();

server.use(bodyParser);

server.post("/products", (req, res, next) => {
  let date = new Date();
  req.body.createAt = date.toISOString();

  if (req.body.price) {
    req.body.price = Number(req.body.price);
  }
  if (req.body.stock) {
    req.body.stock = Number(req.body.stock);
  }

  let hasErrors = false;
  let errors = {};
  //
  if (req.body.title.length < 3) {
    hasErrors = true;
    errors.title = "The name length should be at least 3 characters";
  }
  //
  if (req.body.category.length < 2) {
    hasErrors = true;
    errors.category = "Please select product category";
  }
  //
  if (req.body.price.length < 0) {
    hasErrors = true;
    errors.price = "The price is not valid";
  }
  //
  if (req.body.description.length < 10) {
    hasErrors = true;
    errors.description =
      "The description length should be at least 20 characters";
  }
  //
  if (!req.body.stock) {
    hasErrors = true;
    errors.stock = "Please enter your stock quantity";
  }

  if (hasErrors) {
    res.status(400).jsonp(errors);
    return;
  }

  next();
});

server.listen(4000, () => {
  console.log("JSON Server is running on http://localhost:4000");
});
