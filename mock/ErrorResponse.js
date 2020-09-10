class DummyErrorResponse {
  constructor() {
    this.items = [
      // sample
      // {
      //   controllerName: 'hogehoge',
      //   status: 401
      // }
    ]
  }

  addItem(targetItem) {
    this.items = this.items.filter(
      item => item.controllerName !== targetItem.controllerName
    )
    this.items.push(targetItem)
  }

  clear() {
    this.items = []
  }
}

const dummyErrorResponse = new DummyErrorResponse()
const ErrorResponseMiddleware = controllerName => {
  return (req, res, next) => {
    const errorResponseDetail = dummyErrorResponse.items.find(
      item => item.controllerName === controllerName
    )
    if (errorResponseDetail !== undefined) {
      return res.sendStatus(errorResponseDetail.status)
    }

    next()
  }
}

module.exports = {
  dummyErrorResponse,
  ErrorResponseMiddleware,
}
