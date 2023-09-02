import express from 'express'
import { port } from './config'
import { engine } from 'express-handlebars'
import path from 'path'
import web from './routes/web'
import api from './routes/api'

const app = express()
app.use(express.json())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '../../src/views')) // this assume that is running from dist folder
app.engine('handlebars', engine())

app.get('/', (req, res) => {
  res.redirect('/static')
})
app.use('/static', web)
app.use('/api', api)
app.use('/*', (req, res) => {
  res.render('error404')
})

app.listen(port)
console.log(`🤘 [server]: Talk-a-Bot-Server running at http://localhost:${port}`)
