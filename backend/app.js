const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path'); 
const userRoutes  = require('./routes/user'); 
const sauceRoutes = require('./routes/sauce'); 

mongoose.connect('mongodb+srv://new_user:Eqpe0Lk7YzL0HI0I@cluster0.gnrcq.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Allows everybody to use this route
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


app.use(express.json());

//Adding images path
app.use("./images", express.static(path.join(__dirname, "images")));

//Users routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

 module.exports = app;
