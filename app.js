if (process.env.NODE_END != "production") {
    require("dotenv").config()
}

const express       = require("express");
// const bodyParser    = require("body-parser");
const app           = express();
const path          = require("path");
const db            = require("./db");
const collection    = "todo";
const bctypt        = require("bcrypt")
const passport      = require("passport")
const flash         = require("express-flash")
const session       = require("express-session")

let multer = require('multer');
let upload = multer();

const initializePassport = require("./passport-config")
initializePassport(
    passport,
    email => users.find(user => user.email === email)
)

const users = []

app.set("view-engine", "ejs")
// app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get("/", (req, res) => {
    res.render("index.ejs");
});
app.get("/register-admin", (req, res) => {
    res.render("register-admin.html");
})

// Database Retrieve Route
app.get("/getTodos", (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if (err) console.log(err);
        else {
            console.log(documents);
            res.json(documents);
        }
    });
});


app.post("/register-admin", async (req, res) => {
    try {
        const hashedPassword = bcrypt.hash(req.body.password, 10)
        users.push({
            id:         Date.now().toString(),
            name:       req.body.name,
            email:      req.body.email,
            password:   req.body.password

        })
        res.redirect("/index.ejs")
    } catch {
        res.redirect("/register-admin.html")
    }
    req.body.email
});

db.connect((err) => {
    if(err) {
        console.log("Unable to connect to database");
        process.exit(1);
    }
    else {
        app.listen(3000, () => {
            console.log("connecting to database, app listening on port 3000");
        });
    }
})
