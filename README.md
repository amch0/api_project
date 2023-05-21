# api_project

This API project is done in Node JS. 
API provider: OpenWeatherMap.
We have three endpoints: forecast, current and map. 

To start this app you need to:
1. Clone the repository to your device
2. Install all the necessary dependencies. Command "npm install"
3. Start the app. Command "nodemon server.js"

In your browser you can access endpoints individually:
1. http://localhost:8000/forecast?place=bihac
2 .http://localhost:8000/current?place=bihac
3. http://localhost:8000/map/clouds_new/3/2/3

or you can access swagger "http://localhost:8000/api-docs/" and access all endpoints at one place.