const express = require("express");
const request = require("request");


const app = express();


  
app.get("/forecast", (req, res) => {
    let place = req.query.place;
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=c562e9d86bf94763385d0dc737069c0f`;

    request(url, function (error, response, body) {
        let data = JSON.parse(body);
        if (data.cod === '200') {
            res.send(`The forecast weather for ${place} is ${data.list[0].weather[0].description}`);
        } else if (data.cod === '404') {
            res.status(400).send(`Error: ${data.message}`);
        } else {
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
        }
    });
});

app.get("/current", (req, res) => {
    let place = req.query.place;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=c562e9d86bf94763385d0dc737069c0f`;

    request(url, function (error, response, body) {
        let data = JSON.parse(body);
        if (data.cod === 200) {
            let weatherDescription = data.weather[0].description;
            res.send(`The current weather in ${place} is ${weatherDescription}`);
        } else if (data.cod === '404') {
            res.status(400).send(`Error: ${data.message}`);
        } else {
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
        }
    });
});

app.get("/map/:layer/:z/:x/:y", (req, res) => {
    const { layer, z, x, y } = req.params;
    const apiKey = "c562e9d86bf94763385d0dc737069c0f";
    const url = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${apiKey}`;

    request(url)
        .pipe(res)
        .on("error", (err) => {
            console.error(err);
            res.sendStatus(400);
        });
});


app.listen(8000, () => console.log("Server started on port 8000"));