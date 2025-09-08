function getCoordsForAddress(address) {
  return {
    lat: 40.7484405,
    lng: -73.9878584,
  }
}

//if you have google maps access
/* const API_KEY=process.env.API_KEY
async function getCoordsForAddress(address) {
  const response = await axios.get(
    `url${encodeURIComponent(address)}&key=${API_KEY}`
  )
} */

module.exports = getCoordsForAddress;