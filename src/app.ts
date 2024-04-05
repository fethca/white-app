import { Logger } from '@fethcat/logger'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import { MainJob } from './jobs/MainJob.js'
import { limiter } from './middlewares/limiter.js'
import { logger } from './middlewares/logger.js'
import { router } from './router.js'
import { store } from './services.js'
import { Message, settings } from './settings.js'

const { instanceId, logs, metadata } = settings
const corsOptions = { origin: 'settings.cors.origin', optionsSuccessStatus: 200 }

export class App {
  logger = Logger.create<Message>(instanceId, logs, metadata)

  async run(dbUri: string): Promise<void> {
    const { success, failure } = this.logger.action('app_start')
    try {
      await this.initRedis()
      await this.initDb(dbUri)
      void new MainJob().run()
      process.on('SIGTERM', this.exit.bind(this))
      success()
    } catch (error) {
      failure(error)
      process.exit(1)
    }
  }

  private async initRedis() {
    const { success, failure } = this.logger.action('redis_init_store')
    try {
      await store.initClient(settings.redis)
      success()
    } catch (error) {
      throw failure(error)
    }
  }

  private async initDb(dbUri: string) {
    const { success, failure } = this.logger.action('init_db')
    try {
      // await mongoose.connect(dbUri, { dbName: settings.mongo.dbName })
      // await sequelize.authenticate()
      // await prisma.$connect()
      success()
    } catch (error) {
      failure(error)
      throw error
    }
  }

  private async startServer() {
    const { success } = this.logger.action('start_server')
    const app = express()
    app.use(helmet())
    app.use(limiter)
    app.use(json())
    app.use(urlencoded({ extended: true }))
    app.use(hpp({ whitelist: ['endpoint'] }))
    app.use(cors(corsOptions))
    app.options('*', cors())
    app.use(logger)
    app.use('/api', router())
    const server = app.listen(metadata.port)
    await new Promise<void>((resolve) => server.on('listening', resolve))
    success()
    return server
  }

  private exit() {
    this.logger.info('app_stop')
  }
}
