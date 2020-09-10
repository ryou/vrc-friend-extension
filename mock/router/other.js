const { getDummyImage, mockError, unmockError } = require('../controller')

const express = require('express')
const router = express.Router()

router.get('/dummyImage/:uid', getDummyImage)
router.post('/mockError', mockError)
router.post('/unmockError', unmockError)

module.exports = router
