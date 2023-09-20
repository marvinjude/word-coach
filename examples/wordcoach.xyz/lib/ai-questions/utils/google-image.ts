import * as cherio from 'cheerio'

interface Image {
  title: string
  source: string
  link: string
  original: string
  thumbnail: string | undefined
}

const selectRandomUserAgent = () => {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36',
  ]
  const randomNumber = Math.floor(Math.random() * userAgents.length)
  return userAgents[randomNumber]
}

/**
 * Crawls Google Images for images based on the query
 * Slight modification of https://hackernoon.com/scrape-google-images-with-node-js
 * Shoutout to the Darshan Khandelwal(https://twitter.com/darshan0_1)
 *
 * @param query the image search query
 * @returns an array of image objects
 */
export const queryToImageURLs = async (query: string) => {
  const user_agent = selectRandomUserAgent()
  const header = {
    'User-Agent': user_agent,
  }

  /*Google API Query string documentation
   * q = query
   * oq = original query
   * hl = language
   * tbm = search type
   * tbs = search options(izs: image size, iar: image aspect ratio, ift: image file type)
   * sourceid = user agent
   * ie = encoding
   */
  // const queryString = `https://www.google.com/search?q=${query}&oq=${query}&hl=en&tbm=isch&async=_id:rg_s,_pms:s,_fmt:pc&sourceid=chrome&ie=UTF-8&tbs=iar:w,ift:jpg`;

  const queryString = `https://www.google.com/search?q=${query}&tbs=iar:w,ift:jpg&sourceid=chrome&ie=UTF-8&udm=2`

  const response = await fetch(queryString, {
    headers: header,
  })

  const $ = cherio.load(await response.text())

  const images: Image[] = []

  $('div.rg_bx').each((_, el) => {
    const json_string = $(el).find('.rg_meta').text()
    const thumbnail =
      $(el).find('.rg_l img').attr('src') ||
      $(el).find('.rg_l img').attr('data-src')

    images.push({
      title: $(el).find('.iKjWAf .mVDMnf').text(),
      source: $(el).find('.iKjWAf .FnqxG').text(),
      link: JSON.parse(json_string).ru,
      original: JSON.parse(json_string).ou,
      thumbnail,
    })
  })

  return images
}
