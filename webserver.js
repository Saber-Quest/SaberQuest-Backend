const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');

const admin = require('./routes/site/admin');
const shop = require('./routes/site/shop');
const gamble = require('./routes/site/gamble');
const leaderboard = require('./routes/site/leaderboard');
const profileWID = require('./routes/site/profileWID');
const profile = require('./routes/site/profile');
const index = require('./routes/site/index');
const inventory = require('./routes/site/inventory');
const fourOhFour = require('./routes/site/404');

const acceptChallenge = require('./routes/api/accept-challenge');
const addChallenge = require('./routes/api/add-challenge');
const addCollectible = require('./routes/api/add-collectible');
const buyItem = require('./routes/api/buy-item');
const changePreference = require('./routes/api/change-preference');
const currentDeals = require('./routes/api/current-deals');
const dailyChallenges = require('./routes/api/daily-challenges');
const decrypt = require('./routes/api/decrypt');
const encrypt = require('./routes/api/encrypt');
const passCors = require('./routes/api/pass-cors')
const gambleAPI = require('./routes/api/gamble');
const modSubmit = require('./routes/api/mod-submit');
const oculusLogin = require('./routes/api/oculus-login');
const steamLogin = require('./routes/api/steam-login');
const topPlayers = require('./routes/api/top-players');
const update = require('./routes/api/update');
const user = require('./routes/api/user');
const validate = require('./routes/api/validate');

const app = express();

// Serve the static files, and favicon

app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// --------------------------------------------------------------------------- SITE ---------------------------------------------------------------------------

app.use('/', index);
app.use('/hello-random-person-looking-at-the-source-code', admin);
app.use('/shop', shop);
app.use('/shop/gamble', gamble);
app.use('/leaderboards/:id', (req, res, next) => {
    req.id = req.params.id;
    next();
}, leaderboard)
app.use('/profile/:id', (req, res, next) => {
    req.id = req.params.id;
    next();
}, profileWID);
app.use('/profile', profile);
app.use('/inventory', inventory);

// --------------------------------------------------------------------------- API ---------------------------------------------------------------------------

app.use('/api/accept-challenge', (req, res, next) => {
    req.token = req.headers.user;
    req.challenge = req.query.challenge;
    next();
}, acceptChallenge);
app.use('/api/add-challenge', (req, res, next) => {
    req.user = req.headers.user;
    req.data = {
        name: req.query.name,
        type: req.query.type,
        source: req.query.source,
        difficulties: req.headers.difficulties
    }
    next();
}, addChallenge);
app.use('/api/add-collectible', (req, res, next) => {
    req.token = req.headers.user;
    req.item = req.query.item;
    next();
}, addCollectible);
app.use('/api/buy-item', (req, res, next) => {
    req.token = req.headers.user;
    req.item = req.headers.item;
    next();
}, buyItem)
app.use('/api/change-preference', (req, res, next) => {
    req.token = req.headers.user;
    req.pref = req.query.preference;
    next();
}, changePreference);
app.use('/api/current-deals', currentDeals);
app.use('/api/daily-challenges', dailyChallenges);
app.use('/api/decrypt/:reason', (req, res, next) => {
    req.reason = req.params.reason;
    next();
}, decrypt);
app.use('/api/encrypt/:reason', (req, res, next) => {
    req.reason = req.params.reason;
    next();
}, encrypt);
app.use('/api/pass-cors', (req, res, next) => {
    req.link = req.query.url;
    next();
}, passCors);
app.use('/api/gamble', gambleAPI);
app.use('/api/mod-submit', (req, res, next) =>{
    req.user = req.headers.user;
    next();
}, modSubmit);
app.use('/api/steam-login', steamLogin);
app.use('/api/oculus-login', (req, res, next) => { 
    req.id = req.headers.id;
    req.type = req.headers.type;
    next();
}, oculusLogin);
app.use('/api/top-players', (req, res, next) => {
    req.page = req.query.page;
    next();
}, topPlayers);
app.use('/api/update', (req, res, next) => {
    req.token = req.headers.user;
    req.item1 = req.query.item1;
    req.item2 = req.query.item2;
    next();
}, update);
app.use('/api/user', (req, res, next) => {
    if (req.headers.type == "no-auth" || req.headers.type == undefined) {
        req.auth = "no-auth"
        req.id = req.query.userId;
    }
    else {
        req.auth = "auth"
        req.id = req.headers.user;
    }
    next();
}, user);
app.use('/api/validate', (req, res, next) => {
    req.token = req.headers.user;
    req.id = req.query.pageId;
    next();
}, validate);

app.use('*', fourOhFour)

// Listen on port 3000

app.listen(3000, () => {
    console.log("Server started on port 3000");
});