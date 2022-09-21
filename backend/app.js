/* Imports */

const express     = require('express'); // Framework Express: création et gestion du serveur
const mongoose    = require('mongoose'); // Connexion à la base de données
const path        = require('path'); // Permet que le navigateur puisse trouver le chemin des dossiers et des fichiers
const helmet      = require('helmet'); // Protection des requêtes HTTP - Headers

const userRoutes  = require('./routes/user'); // Import des routes user
const sauceRoutes = require('./routes/sauce'); // Import des routes sauces

const app         = express();

require('dotenv').config();

/* Connection à MongoDB */

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,

{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(helmet());

/* Gestion du CORS */

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(express.json()); // Extraction des données JSON

app.use('/images', express.static(path.join(__dirname, 'images'))); // Gestionnaire de routage

app.use('/api/auth', userRoutes); // Utilisation des routes user
app.use('/api/sauces', sauceRoutes); // Utilisation des routes sauces

module.exports = app;