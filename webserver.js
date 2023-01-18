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
const addCollectible = require('./routes/api/add-collectible');
const buyItem = require('./routes/api/buy-item');
const currentDeals = require('./routes/api/current-deals');
const dailyChallenges = require('./routes/api/daily-challenges');
const decrypt = require('./routes/api/decrypt');
const encrypt = require('./routes/api/encrypt');
const gambleAPI = require('./routes/api/gamble');
const modSubmit = require('./routes/api/mod-submit');
const steamLogin = require('./routes/api/steam-login');
const topPlayers = require('./routes/api/top-players');
const update = require('./routes/api/update');
const user = require('./routes/api/user');
const validate = require('./routes/api/validate');

const date = new Date();

let currentDb = `${date.getMonth() + 1}${date.getFullYear().toString().slice(2)}`;

let challenges;

let day = date.getUTCDate();

// Check every hour if the database needs to be changed

//setInterval(async () => {
//    const newDate = new Date();
//
//    if (newDate.getMonth() + 1 !== date.getMonth() + 1) {
//        challenges.close();
//        currentDb = `${newDate.getMonth() + 1}${newDate.getFullYear().toString().slice(2)}`;
//        challenges = mongoose.createConnection(`${process.env.MONGO_URL}${currentDb}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
//    }
//
//    if (newDate.getUTCDate() !== day) {
//        day = newDate.getUTCDate();
//        DailyChallenge = challenges.model(`${day}`, new mongoose.Schema({
//            id: String,
//            challenge: String,
//        }), `${day}`);
//
//        day = newDate.getUTCDate();
//
//        const items = await shop.find().exec();
//        const inShop = await shop.find({ id: "selling" }).exec();
//
//        let selling = [];
//        let inNewShop = [];
//        let loops = 0;
//        function MakeSale() {
//            let item = items[Math.floor(Math.random() * items.length)];
//
//            if (item.price == null) return;
//
//            if (item.id !== "selling") {
//                if (inShop[0].currentlySelling.includes(item.id)) return MakeSale();
//                selling.push({
//                    id: item.id,
//                    price: item.price,
//                    rarity: item.rarity,
//                });
//                inNewShop.push(item.id);
//                items.splice(items.indexOf(item), 1);
//                loops++;
//            }
//        }
//
//        while (loops < 5) {
//            MakeSale();
//        }
//    }
//}, 1000 * 60);

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
app.use('/api/add-collectible', (req, res, next) => {
    req.token = req.headers.user;
    req.item = req.query.item;
}, addCollectible);
app.use('/api/buy-item', (req, res, next) => {
    req.token = req.headers.user;
    req.item = req.headers.item;
    next();
}, buyItem)
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
app.use('/api/gamble', gambleAPI);
app.use('/api/mod-submit', (req, res, next) =>{
    req.user = req.headers.user;
    next();
}, modSubmit);
app.use('/api/steam-login', steamLogin);
app.use('/api/top-players', topPlayers);
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