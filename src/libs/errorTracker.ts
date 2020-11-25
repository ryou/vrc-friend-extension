import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'

class ErrorTracker {
  constructor() {
    Sentry.init({
      dsn: '',
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    })
  }

  sendErrorLog(error: any) {
    Sentry.captureException(error)
  }
}

export const errorTracker = new ErrorTracker()
