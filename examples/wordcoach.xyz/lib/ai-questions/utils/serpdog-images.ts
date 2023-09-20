interface SerdogResponse {
  image_results: {
    original: string
    link: string
    source: string
    title: string
    original_size: string
  }[]
}

export const querySerpdog = async (query: string): Promise<SerdogResponse> => {
  const response = await fetch(
    `https://api.serpdog.io/images?api_key=${process.env.SERDOG_API_KEY}&q=${query}&gl=us&tbs=iar:w,ift:jpg`
  )

  const data: SerdogResponse = await response.json()

  return data
}
