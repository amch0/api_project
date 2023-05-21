const express = require("express");
const request = require("request");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const app = express();
const { getData } = require("./caching");

const spec = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Weather API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: ['./server.js'], 
};

const swaggerSpec = swaggerJSDoc(spec);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /forecast:
 *   get:
 *     summary: Get forecast weather
 *     parameters:
 *       - in: query
 *         name: place
 *         required: true
 *         description: The location for which to get the forecast
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       "400":
 *         description: Error response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */

app.get("/forecast", (req, res) => {
    const place = req.query.place;
    const key = `forecast_${place}`; 
  
    
    const fetchForecast = () => {
      return new Promise((resolve, reject) => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=c562e9d86bf94763385d0dc737069c0f`;
  
        console.log("Incoming request for forecast:", req.query);
  
        request(url, function (error, response, body) {
          if (error) {
            reject(error);
            return;
          }
  
          const data = JSON.parse(body);
          if (data.cod === "200") {
            console.log("Forecast retrieved for", place);
            const forecast = data.list[0].weather[0].description;
            resolve(forecast);
          } else if (data.cod === "404") {
            console.log("Error retrieving forecast:", data.message);
            reject(new Error(data.message));
          } else {
            console.log("Unexpected error:");
            console.log("statusCode:", response && response.statusCode);
            console.log("body:", body);
            reject(new Error("Unexpected error occurred"));
          }
        });
      });
    };
  
    // Call the getData function from caching.js
    getData(key, fetchForecast)
      .then((forecast) => {
        res.send(`The forecast weather for ${place} is ${forecast}`);
      })
      .catch((error) => {
        console.error("Error:", error);
        res.status(400).send("Internal Server Error");
      });
  });


/**
 * @swagger
 * /current:
 *   get:
 *     summary: Get current weather
 *     parameters:
 *       - in: query
 *         name: place
 *         required: true
 *         description: The location for which to get the current weather
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       "400":
 *         description: Error response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get("/current", (req, res) => {
    const place = req.query.place;
    const key = `current_${place}`; // Key for caching
  
    
    const fetchCurrentWeather = () => {
      return new Promise((resolve, reject) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=c562e9d86bf94763385d0dc737069c0f`;
  
        console.log("Incoming request for current weather:", req.query);
  
        request(url, function (error, response, body) {
          if (error) {
            reject(error);
            return;
          }
  
   const data = JSON.parse(body);
          if (data.cod === 200) {
            console.log('Current weather retrieved for', place);
            const weatherDescription = data.weather[0].description;
            resolve(weatherDescription);
          } else if (data.cod === '404') {
            console.log('Error retrieving current weather:', data.message);
            reject(new Error(data.message));
          } else {
            console.log('Unexpected error:');
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
            reject(new Error('Unexpected error occurred'));
          }
        });
      });
    };
  
   // Call the getData function from caching.js
    getData(key, fetchCurrentWeather)
      .then((weatherDescription) => {
        res.send(`The current weather in ${place} is ${weatherDescription}`);
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(400).send('Internal Server Error');
      });
  });
  

/**
 * @swagger
 * /map/{layer}/{z}/{x}/{y}:
 *   get:
 *     summary: Get map tile for a specific layer
 *     parameters:
 *       - in: path
 *         name: layer
 *         required: true
 *         description: The layer for the map tile
 *         schema:
 *           type: string
 *       - in: path
 *         name: z
 *         required: true
 *         description: The zoom level of the map tile
 *         schema:
 *           type: string
 *       - in: path
 *         name: x
 *         required: true
 *         description: The x-coordinate of the map tile
 *         schema:
 *           type: string
 *       - in: path
 *         name: y
 *         required: true
 *         description: The y-coordinate of the map tile
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Successful response
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       "400":
 *         description: Error response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get("/map/:layer/:z/:x/:y", (req, res) => {
  const { layer, z, x, y } = req.params;
  const apiKey = "c562e9d86bf94763385d0dc737069c0f";
  const url = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${apiKey}`;

  console.log('Incoming request for map:', req.params);

  request(url)
    .on("response", (response) => {
      console.log('Map request status:', response.statusCode);
    })
    .on("error", (err) => {
      console.error('Error retrieving map:', err);
      res.sendStatus(400);
    })
    .pipe(res);
});



app.listen(8000, () => {
    console.log("Server started on port 8000");
  });
  