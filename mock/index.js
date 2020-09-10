const express = require('express')
const { PORT } = require('./config')
const api = require('./router/api')
const news = require('./router/news')
const other = require('./router/other')

const app = express()
app.use(express.static('mock/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-API-KEY')
  next()
})

app.use((req, res, next) => {
  if (process.env.SEND_ERROR_STATUS !== undefined) {
    return res.sendStatus(process.env.SEND_ERROR_STATUS)
  }

  next()
})

app.use('/api/1', api)
app.use('/news', news)
app.use('/', other)

app.listen(PORT, () => console.log(`Api mock listening on port ${PORT}!`))
