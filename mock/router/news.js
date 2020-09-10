const { listNews } = require('../controller')
const { ErrorResponseMiddleware } = require('../ErrorResponse')

const express = require('express')
const router = express.Router()

router.get('/', ErrorResponseMiddleware('listNews'), listNews)

module.exports = router
