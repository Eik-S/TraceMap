import { mockFn } from '../../utils/mock-fn'
import { requestFollowingResponseMock } from '../mastodon-api/mock-data/request-following-mocks'
import { crawlRequestDataMock } from './mock-data/crawl-request-data-mock'
import { getUserFollowees } from './user-crawler'
import { requestFollowing } from '../mastodon-api/request-following'

jest.mock('../mastodon-api/request-following')

describe('crawler.ts', () => {
  describe('getUserFollowees', () => {
    it('returns a list of acct handles on successful mastodon request', async () => {
      mockFn(requestFollowing).mockResolvedValueOnce(requestFollowingResponseMock)
      await expect(getUserFollowees(crawlRequestDataMock)).resolves.toMatchInlineSnapshot(`
        [
          "linuzifer@23.social",
          "tazgetroete@mastodon.social",
          "elhotzo@mastodon.social",
          "MiroD@mastodon.social",
          "amadeuantonio@troet.cafe",
          "anneroth@systemli.social",
          "Kaddastrophe@det.social",
          "timpritlove@mastodon.social",
          "netzpolitik@loma.ml",
          "janboehm@edi.social",
        ]
      `)
    })

    it('all returned acct handles got a server', async () => {
      mockFn(requestFollowing).mockResolvedValueOnce(requestFollowingResponseMock)
      const handles = await getUserFollowees(crawlRequestDataMock)
      handles.forEach((handle) => expect(handle).toContain('@'))
    })
  })
})
