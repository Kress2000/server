require('dotenv').config()
const connectToDb = require('./src/configs/connection')
const express = require('express')
const router = require('./src/routes/routers')
const app = express()
app.use(express.json())
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static('uploads'))
const bodyParser = require('body-parser')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
swaggerDocument = require('./swagger.json')
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: false}));
//port
const PORT = process.env.PORT || 5000
var cors = require('cors')

app.use(session({ secret: 'melody hensley is my spirit animal' }))
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'secrete',
  }),
)
app.use(expressLayouts)

// Connect to MongoDB
connectToDb()
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)
app.use('/mybrand', cors({origin: '*'}), router,)
app.use(cors({ origin: '*'}))
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCssUrl:
      'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css',
  }),
)

app.listen(PORT, () => console.log('connected!'))
module.exports = app
