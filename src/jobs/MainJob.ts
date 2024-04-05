import { ILogger, Logger } from '@fethcat/logger'
import { Message, settings } from '../settings.js'

const { instanceId, logs, metadata } = settings

export class MainJob {
  protected logger: ILogger<Message> = Logger.create<Message>(instanceId, logs, metadata)

  async run(): Promise<void> {
    const { success, failure } = this.logger.action('main_job')
    try {
      success()
    } catch (error) {
      failure(error)
      throw error
    }
  }
}
