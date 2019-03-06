require('dotenv').config()
import fs from 'fs'
import path from 'path'
import https from 'https'
import Axios from 'axios'
import helmet from 'helmet'
import express from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import connectRedis from 'connect-redis'
import expressSession from 'express-session'
import DiscordStrategy from 'passport-discord'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export class Server {
  constructor() {
    this.app = express()
    this.appPath = path.join(__dirname, '../app/')
    this.https = {
      ca: fs.readFileSync(path.join(process.env.API_HTTPS_CA)),
      key: fs.readFileSync(path.join(process.env.API_HTTPS_KEY)),
      cert: fs.readFileSync(path.join(process.env.API_HTTPS_CRT))
    }
    this.discordScopes = ['identify', 'guilds']

    // Sessions
    this.redisStore = connectRedis(expressSession)
    this.app.use(expressSession({
      secret: 'mySecretKey',
      store: new this.redisStore({
        host: 'localhost',
        port: 6379
      }),
      resave: true,
      saveUninitialized: true
    }))

    // Passport
    this.passportConfig()
    this.app.use(passport.initialize())
    this.app.use(passport.session())

    // Middleware
    this.app.use(helmet())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({
      extended: true
    }))
    this.app.use(cookieParser())

    // CORS
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    // Static Assets
    this.app.use('/assets', express.static(path.join(__dirname, '../app')))

    // Routes
    this.app.get('/callback', passport.authenticate('discord', {
      successRedirect: '/',
      failureRedirect: '/'
    }), (req, res) => {
      res.redirect('/info')
    })
    this.app.get('/logout', this.forceLogout, (req, res, next) => {
      req.logout()
      res.redirect('/')
    })
    this.app.get('/login', passport.authenticate('discord', {
      scope: this.discordScopes
    }), (req, res) => {})
    this.app.get('/info', this.checkAuth, (req, res) => {
      res.json(req.user)
    })
    // this.app.get('/app', this.checkAuth, (req, res) => { res.status(200).sendFile(path.join(this.appPath, 'app.html')) })
    this.app.get('/', this.checkAuth, (req, res) => {
      res.status(200).sendFile(path.join(this.appPath, 'app.html'))
    })

    this.httpsServer = https.createServer(this.https, this.app)
  }

  start() {
    this.listen()
  }

  listen() {
    this.httpsServer.listen(8235, () => {
      console.log(`kiera-web listening`)
    })
  }

  passportConfig() {
    passport.serializeUser(function (user, done) {
      // console.log('SERIALIZE', user)
      done(null, user)
    })
    passport.deserializeUser(function (obj, done) {
      // console.log('DESERIALIZE-USER', obj)
      done(null, obj)
    })

    passport.use(new DiscordStrategy.Strategy({
        clientID: process.env.DISCORD_APP_ID,
        clientSecret: process.env.DISCORD_APP_SECRET,
        callbackURL: process.env.DISCORD_APP_CALLBACK,
        scope: this.discordScopes
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log('profile', profile)
        // User.findOrCreate({ discordId: profile.id }, function (err, user) {
        // Talk to Bot for auth
        const resp = await this.loginWithBot(profile)
        console.log(resp.status)
        if (resp.status) {
          return done(null, Object.assign({
            webToken: resp.webToken
          }, profile))
        } else {
          /// TODO: Fail login
        }
      }))
  }

  checkAuth(req, res, next) {
    console.log('checkAuth', req.isAuthenticated())
    if (req.isAuthenticated()) {
      res.cookie('kiera-discord-id', req.user.id)
      res.cookie('kiera-webToken', encodeURIComponent(req.user.webToken))
    }
    // res.send('not logged in :(')
    return next()
  }

  forceLogout(req, res, next) {
    res.cookie('kiera-discord-id', null)
    res.cookie('kiera-webToken', null)
    return next()
  }

  async loginWithBot(profile) {
    const resp = await Axios(`${process.env.BOT_HOST}/oauth`, {
      method: 'POST',
      data: profile,
      headers: {
        AuthKey: process.env.BOT_AUTHKEY
      }
    });

    if (resp.status === 200) return resp.data
  }
}