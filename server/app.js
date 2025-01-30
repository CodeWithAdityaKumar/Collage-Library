const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const CreateAdmin = require('./controllers/createUser/admin');
const loginUserAdmin = require('./controllers/loginUser/admin');
const isAdmin = require('./middlewares/admin/checkIsAdmin');
const isLoggedIn = require('./middlewares/isLoggedIn');



app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/api/admin/user/register", (req, res) => {
    CreateAdmin(req, res);
})

app.get("/pages/login/admin", (req, res) => {
  res.render("admin/adminLogin");
});

app.post("/api/login/admin", (req, res) => {
    loginUserAdmin(req, res);
});

app.get("/pages/admin/dashboard", (req, res) => {
    res.render("admin/adminDashboard")
});

app.post("/pages/admin/dashboard/verify", isAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin verified successfully"
    });
});



app.get("/pages/login/faculty", (req, res) => {
  res.render("faculty/facultyLogin");
});

app.post("/api/login/faculty", (req, res) => {
  loginUserAdmin(req, res);
});

app.get("/pages/faculty/dashboard", (req, res) => {
  res.render("faculty/facultyDashboard");
});







app.post("/api/isLoggedIn", isLoggedIn, (req, res) => {
    
    res.status(200).json({
        success: true,
        role: req.decoded.role,
        message: "User is logged in"
    });

});


app.get("/api/logout", (req, res) => {
    res.clearCookie("accesstoken");
    res.redirect("/");
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});