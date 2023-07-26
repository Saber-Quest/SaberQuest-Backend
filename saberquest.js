const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const io = require("./websocket/websocket");

const fourOhFour = require('./routes/site/404');
const avatar = require('./routes/site/avatar');
const challenges = require('./routes/site/challenges');
const index = require('./routes/site/index');
const inventory = require('./routes/site/inventory');
const leaderboard = require('./routes/site/leaderboard');
const linkDiscordPage = require('./routes/site/link-discord');
const profile = require('./routes/site/profile');
const profileWID = require('./routes/site/profileWID');
const sabers = require('./routes/site/sabers');
const shop = require('./routes/site/shop');

const acceptChallenge = require('./routes/api/accept-challenge');
const addChallenge = require('./routes/api/add-challenge');
const addCollectible = require('./routes/api/add-collectible');
const blLogin = require('./routes/api/bl-login');
const buyItem = require('./routes/api/buy-item');
const changePreference = require('./routes/api/change-preference');
const connectDiscord = require('./routes/api/connect-discord');
const currentDeals = require('./routes/api/current-deals');
const dailyChallenges = require('./routes/api/daily-challenges');
const decrypt = require('./routes/api/decrypt');
const encrypt = require('./routes/api/encrypt');
const passCors = require('./routes/api/pass-cors');
const gambleAPI = require('./routes/api/gamble');
const items = require('./routes/api/items');
const linkDiscord = require('./routes/api/link-discord');
const steamLogin = require('./routes/api/steam-login');
const topPlayers = require('./routes/api/top-players');
const update = require('./routes/api/update');
const user = require('./routes/api/user');
const validate = require('./routes/api/validate');

const app = express();

// Serve the static files, and favicon

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// --------------------------------------------------------------------------- SITE ---------------------------------------------------------------------------

app.use('/', (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    next();
}, index);
app.use('/avatar/:id', (req, res, next) => {
    req.img = req.params.id;
    next();
}, avatar);
app.use('/challenges', (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    next();
}, challenges);
app.use('/shop', (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    next();
}, shop);
app.use('/leaderboards/:id', (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    req.id = req.params.id;
    next();
}, leaderboard);
app.use('/link-discord/:id', (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    req.id = req.params.id;
    next();
}, linkDiscordPage);
app.use('/profile/:id', (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    req.id = req.params.id;
    next();
}, profileWID);
app.use('/profile', (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    next();
}, profile);
app.use('/saber_test', (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    next();
}, sabers);
app.use('/inventory', (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    next();
}, inventory);

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
app.use('/api/bl-login', (req, res, next) => {
    req.code = req.query.code;
    req.iss = req.query.iss;
    next();
}, blLogin);
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
app.use('/api/connect-discord', (req, res, next) => {
    req.id = req.body.id;
    req.token = req.body.token;
    next();
}, connectDiscord);
app.use('/api/current-deals', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, currentDeals);
app.use('/api/daily-challenges', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, dailyChallenges);
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
app.use('/api/items', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, items);
app.use('/api/link-discord', (req, res, next) => {
    req.code = req.query.code;
    next();
}, linkDiscord);
app.use('/api/steam-login', steamLogin);
app.use('/api/top-players', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    req.page = req.query.page;
    next();
}, topPlayers);
app.use('/api/update', (req, res, next) => {
    req.token = req.headers.user;
    req.item1 = req.query.item1;
    req.item2 = req.query.item2;
    next();
}, update);
app.use('/api/user/:id', (req, res, next) => {
    req.auth = "no-auth"
    req.id = req.params.id;
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, user);
app.use('/api/user', (req, res, next) => {
    req.auth = "auth"
    req.id = req.headers.user;
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, user);
app.use('/api/validate', (req, res, next) => {
    req.token = req.headers.user;
    req.id = req.query.pageId;
    next();
}, validate);

// --------------------------------------------------------------------------- MISC ---------------------------------------------------------------------------

app.get("/one-click", (req, res) => {
    const mapId = req.query.map;
    res.redirect(`beatsaver://${mapId}`);
});

app.use('*', fourOhFour)

// Listen on port 3000

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

process.on('uncaughtException', (err, origin) => {
    console.log(err);
    io.emit('serverError', {
        name: err.name,
        message: err.message
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason);
    promise.catch((err) => {
        io.emit('serverError', {
            name: err.name || "Unhandled Rejection",
            message: err.message || "No message"
        });
    });
});