const express = require('express')
const router = express.Router()
const {
  getFriends,
  listFavorites,
  getWorld,
  listWorlds,
  getInstanceInfo,
} = require('../controller')
const { ErrorResponseMiddleware } = require('../ErrorResponse')

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

router.use(async (req, res, next) => {
  await sleep(1000)
  next()
})

router.get(
  '/auth/user/friends',
  ErrorResponseMiddleware('getFriends'),
  getFriends
)
router.get(
  '/favorites',
  ErrorResponseMiddleware('listFavorites'),
  listFavorites
)
router.get('/worlds/:id', ErrorResponseMiddleware('getWorld'), getWorld)
router.get('/worlds', ErrorResponseMiddleware('listWorlds'), listWorlds)
router.get(
  '/instances/:location',
  ErrorResponseMiddleware('getInstanceInfo'),
  getInstanceInfo
)

module.exports = router
