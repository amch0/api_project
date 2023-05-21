const NodeCache = require("node-cache");
const cache = new NodeCache();

// Function to retrieve data from cache or fetch it if not available
function getData(key, fetchData) {
  const value = cache.get(key);
  if (value) {
    console.log("Data retrieved from cache");
    return Promise.resolve(value);
  } else {
    console.log("Fetching data...");
    return fetchData().then((data) => {
      cache.set(key, data);
      console.log("Data stored in cache");
      return data;
    });
  }
}

module.exports = {
  getData,
};
