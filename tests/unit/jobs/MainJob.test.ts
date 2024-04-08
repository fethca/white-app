import { MockedLogger, mockAction } from '@fethcat/logger'
import * as utils from '../../../src/helpers/utils.js'
import { MainJob } from '../../../src/jobs/MainJob.js'

describe('run', () => {
  function createJob() {
    const job = new MainJob()
    job['logger'] = new MockedLogger()
    return job
  }

  beforeEach(() => {
    vi.spyOn(utils, 'wait').mockImplementation(() => Promise.resolve())
  })

  it('should log success', async () => {
    const job = createJob()
    const { success } = mockAction(job['logger'])
    await job.run()
    expect(success).toHaveBeenCalledWith()
  })

  it('should log failure and throw', async () => {
    vi.spyOn(utils, 'wait').mockRejectedValue(new Error('500'))
    const job = createJob()
    const { failure } = mockAction(job['logger'])
    await expect(job.run()).rejects.toThrow(new Error('500'))
    expect(failure).toHaveBeenCalledWith(new Error('500'))
  })
})
