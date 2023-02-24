//initialize unsplash

import { createApi } from 'unsplash-js'

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
})

const getDataForCoffeeStores = async (latLong, limit) => {
  const sdk = require('api')('@yelp-developers/v1.0#2vqu0dboldn2hxnb')

  sdk.auth(`Bearer ${process.env.NEXT_PUBLIC_YELP_API_KEY}`)
  const latLongSplit = latLong.split(',')

  const { data } = await sdk.v3_business_search({
    latitude: latLongSplit[0],
    longitude: latLongSplit[1],
    term: 'coffee',
    sort_by: 'best_match',
    limit,
  })

  return data
}

const getListOfCoffeeStorePhotos = async (limit) => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: limit,
  })
  const unsplashResults = photos.response?.results || []
  return unsplashResults.map((result) => result.urls['small'])
}

export const fetchCoffeeStores = async (
  latLong = '43.6538,-79.3789',
  limit = 20
) => {
  const photos = await getListOfCoffeeStorePhotos(limit)

  const { businesses } = await getDataForCoffeeStores(latLong, limit)

  return businesses.map((result, idx) => {
    return {
      id: result.id,
      address: `${result.location.address1}, ${result.location.city}`,
      name: result.name,
      imgUrl: result.image_url
        ? result.image_url
        : photos[idx]
        ? photos[idx]
        : null,
      voting: 0,
    }
  })
}
