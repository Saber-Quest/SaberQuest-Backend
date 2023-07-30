import express, { Request, Response, NextFunction, Application } from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import io from './websocket/websocket';
import bodyParser from 'body-parser';

import fourOhFour from './routes/site/404';
import avatar from './routes/site/avatar';
import challenges from './routes/site/challenges';
import index from './routes/site/index';
import inventory from './routes/site/inventory';
import leaderboard from './routes/site/leaderboard';
import linkDiscordPage from './routes/site/link-discord';
import profile from './routes/site/profile';
import sabers from './routes/site/sabers';
import shop from './routes/site/shop';

import acceptChallenge from './routes/api/accept-challenge';
import addCollectible from './routes/api/add-collectible';
import blLogin from './routes/api/bl-login';
import buyItem from './routes/api/buy-item';
import changePreference from './routes/api/change-preference';
import connectDiscord from './routes/api/connect-discord';
import currentDeals from './routes/api/current-deals';
import dailyChallenges from './routes/api/daily-challenges';
import decrypt from './routes/api/decrypt';
import passCors from './routes/api/pass-cors';
import gambleAPI from './routes/api/gamble';
import items from './routes/api/items';
import linkDiscord from './routes/api/link-discord';
import steamLogin from './routes/api/steam-login';
import topPlayers from './routes/api/top-players';
import update from './routes/api/update';
import user from './routes/api/user';
import validate from './routes/api/validate';

const app: Application = express();

// Serve the static files, and favicon

app.disable('x-powered-by');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// --------------------------------------------------------------------------- SITE ---------------------------------------------------------------------------

app.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    next();
}, index);
app.use('/avatar/:id', (req: Request, res: Response, next: NextFunction) => {
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
    //req.id = req.params.id;
    next();
}, leaderboard);
app.use('/link-discord/:id', (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), payment=()');
    //req.id = req.params.id;
    next();
}, linkDiscordPage);
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
    next();
}, acceptChallenge);
app.use('/api/add-collectible', (req, res, next) => {
    next();
}, addCollectible);
app.use('/api/bl-login', (req, res, next) => {
    next();
}, blLogin);
app.use('/api/buy-item', (req, res, next) => {
    next();
}, buyItem)
app.use('/api/change-preference', (req, res, next) => {
    next();
}, changePreference);
app.use('/api/connect-discord', (req, res, next) => {
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
app.use('/api/decrypt', (req, res, next) => {
    next();
}, decrypt);
app.use('/api/pass-cors', (req, res, next) => {
    next();
}, passCors);
app.use('/api/gamble', gambleAPI);
app.use('/api/items', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, items);
app.use('/api/link-discord', (req, res, next) => {
    next();
}, linkDiscord);
app.use('/api/steam-login', steamLogin);
app.use('/api/top-players', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, topPlayers);
app.use('/api/update', (req, res, next) => {
    next();
}, update);
app.use('/api/user', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, user);
app.use('/api/validate', (req, res, next) => {
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