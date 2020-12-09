const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const frontApp = express();
const port = 3000;
var frontPort = 8080; 
var path = require('path');

// default options
app.use(fileUpload());

app.use((req, res, next) => {
    // Websiteyouwishtoallowtoconnect
    res.setHeader("Access-Control-Allow-Origin", "*");
  
    // Requestmethodsyouwishtoallow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,OPTIONS,PUT,PATCH,DELETE"
    );
  
    // Requestheadersyouwishtoallow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
  
    // Settotrueifyouneedthewebsitetoincludecookiesintherequestssent
    // totheAPI(e.g.incaseyouusesessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
  
    // Passtonextlayerofmiddleware
    next();
  });

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.fileImage;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./public/images/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
    res.send('File uploaded!');
  });
});

app.post('/', function (req, res, next) {
    res.send('Hello World');
});
app.get('/call/python', pythonProcess)

function pythonProcess(req, res) {

  console.log(`name: ${req.query.name}, from: ${req.query.from}`)

  let spawn = require("child_process").spawn

  let process = spawn('python', [
    "./imageCalculate.py",
    req.query.name,
    req.query.from
  ])

  process.stdout.on('data', (data) => {
    const parsedString = JSON.parse(data)
    res.json(parsedString)
  })

} 

frontApp.get('/',function (req, res, next) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(port, function () {
    console.log('Express app started on ' + port);
});

frontApp.listen(frontPort,function() {
    console.log('Express app started on ' + frontPort);
})