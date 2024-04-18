import { ILogger, Logger } from '@fethcat/logger'
import { wait } from '../helpers/utils.js'
import { Message, settings } from '../settings.js'

const { instanceId, logs, metadata } = settings

export class MainJob {
  protected logger: ILogger<Message> = Logger.create<Message>(instanceId, logs, metadata)

  async run(): Promise<void> {
    const { success, failure } = this.logger.action('main_job')
    try {
      await wait(1000)
      success()
    } catch (error) {
      failure(error)
      throw error
    }
  }
}
