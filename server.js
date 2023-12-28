require("dotenv").config({ path: "./.env" });
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
var app = express();
const PORT = process.env.PORT || 3000;

require("./models/database").databaseconnection();

const indexRouter = require('./routes/indexRouter')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: "jk43t9",
    })
);
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  }

  var cors = require('cors');
  app.use(cors(corsOptions));

  app.use('/',indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = err;
    res.status(500).json({ error: err });
});

if (process.env.NODE_ENV === "production") {
    const path = require("path");
    app.get("/", (req, res) => {
        app.use(express.static(path.resolve(__dirname, "views", "build")));
        res.sendFile(path.resolve(__dirname, "views", "build", "index.html"));
    });
}

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));