const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./src/config/.env" });
const cors = require("cors");

const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { BadRequest, NotFound } = require("./utils/errors");

const app = express();
const socket = require("socket.io");

const OrderDal = require("./data-access/OrderDal");

app.use(cors());

app.use((req, res, next) => {
  res.locals.md5 = (param) => md5(param);
  res.locals.createToken = (param) => jwt.sign(param, process.env.JWT_SECRET);
  res.locals.badRequestError = (message) => next(new BadRequest(message));
  res.locals.notFoundError = (message) => next(new NotFound(message));
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("morgan")("dev"));
app.use(require("./routers"));
app.use(require("./middlewares/handleErrors"));

const PORT = 3000 || process.env.PORT;
mongoose
  .connect(process.env.DB_HOST, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then((connected) => {
    console.log("db connected");
  });
let server = app.listen(PORT, () => console.log(`Working on ${PORT}`));

const io = socket(server);
const orderDal = new OrderDal();
io.on("connection", function (socket) {
  socket.on("joinRestaurantChannel", (val) => {
    socket.join(val);
    console.log("channel" + val);

    socket.on("orderIsReady", (text) => {
      console.log(text);
      console.log(val);
      socket.join(val);
      io.to(val).emit("sendOrderIsReady", text);
    });
  });

  socket.on("sendOrderRequest", (val) => {
    console.log(val);
    socket.join(val.channel);
    orderDal
      .getOrderById({ restaurant: val.channel, table: val.tableId })
      .then((order) => {
        console.log(order);
        io.to(val.channel).emit("takeOrderRequest", order);
      });
  });
});
