var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session")
const fs = require("fs");
require('dotenv').config()

const mongoURI = process.env.MONGO_URI;

function connectMongoServer() {
  console.log("MongoDB bağlantısı kuruluyor...");

  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("MongoDB bağlantısı başarılı.");
    })
    .catch((err) => {
      console.error("MongoDB bağlantı hatası:", err);
      console.log("2 saniye sonra tekrar denenecek...");
      setTimeout(connectMongoServer, 2000);
    });
}

mongoose.connection.on("connected", () => {
  console.log("MongoDB bağlantısı kuruldu.");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB bağlantı hatası: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB bağlantısı kesildi, tekrar bağlanıyor...");
  connectMongoServer();
});

connectMongoServer();

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: mongoURI }),
    cookie: { secure: false },
  })
);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use("/", require("./client/index"));
app.use("/api", require("./server/index"));

module.exports = app;
