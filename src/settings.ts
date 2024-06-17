import { extractPackageJson } from '@fethcat/shared/helpers'
import { logsValidators, mongoValidators, redisValidators, validateEnv } from '@fethcat/validator'
import { randomBytes } from 'crypto'
import { num, str } from 'envalid'
import mongoose, { QueryOptions } from 'mongoose'

const { name, version } = extractPackageJson()

const env = validateEnv({
  ...mongoValidators,
  ...logsValidators,
  ...redisValidators,
  DB_NAME: str(),
  PORT: num({ default: 3000 }),
})

const instanceId = randomBytes(16).toString('hex')

export const settings = {
  instanceId,
  metadata: { app: name, version, port: env.PORT, env: env.APP_STAGE },
  logs: {
    silent: env.LOG_SILENT,
  },
  mongo: {
    dbName: env.DB_NAME,
    url: env.DB_URL,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    keyPrefix: `${name}:`,
    cacheDuration: env.REDIS_CACHE_DURATION,
  },
}

const messages = ['redis_init_store', 'main_job', 'init_db', 'start_server'] as const

export type Message = (typeof messages)[number]

const Query_setOptions = mongoose.Query.prototype.setOptions
mongoose.Query.prototype.setOptions = function (options: QueryOptions, overwrite?: boolean) {
  return Query_setOptions.call(this, { ...options, lean: true }, overwrite)
}
mongoose.set('strictQuery', true)
