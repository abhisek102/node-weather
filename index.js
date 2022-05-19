const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync('index.html', 'utf-8');

const replaceVal = (tempVal, orgVal) => {
  let temprature = tempVal.replace('{%tempval%}', orgVal.main.temp);
  temprature = temprature.replace('{%tempmin%}', orgVal.main.temp_min);
  temprature = temprature.replace('{%tempmax%}', orgVal.main.temp_max);
  temprature = temprature.replace('{%location%}', orgVal.name);
  temprature = temprature.replace('{%country%}', orgVal.sys.country);
  return temprature;
};

const server = http.createServer((req, res) => {
  if (req.url == '/') {
    requests(
      'https://api.openweathermap.org/data/2.5/weather?q=angul&units=metric&appid=0755fc65bf4418f9fc447090f90b94e7'
    )
      .on('data', (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realtimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join('');
        res.write(realtimeData);
        console.log('server started');
        console.log(realtimeData);

        // res.write(realtimeData);
      })
      .on('end', (err) => {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
      });
  }
});
server.listen(8000);
