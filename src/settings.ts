import { extractPackageJson } from '@fethcat/shared'
import { logsValidators, redisValidators, validateEnv } from '@fethcat/validator'
import { randomBytes } from 'crypto'
import { num } from 'envalid'

const { name, version } = extractPackageJson()

const env = validateEnv({
  ...logsValidators,
  ...redisValidators,
  PORT: num({ default: 3000 }),
})

const instanceId = randomBytes(16).toString('hex')

export const settings = {
  instanceId,
  metadata: { app: name, version, port: env.PORT, env: env.APP_STAGE },
  logs: {
    silent: env.LOG_SILENT,
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
