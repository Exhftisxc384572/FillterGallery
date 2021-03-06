const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const frontApp = express();
const port = 3000;
var frontPort = 8000; 
var path = require('path');

// default options
app.use(fileUpload());
frontApp.use(express.static(path.join(__dirname)));
console.log(path.join(__dirname))

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
  sampleFile.mv('./public/upload/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
    res.send('File uploaded!');
  });
});

app.post('/', function (req, res) {
    res.send('Hello World');
});
app.get('/call/python', pythonProcess)

function pythonProcess(req, res) {

  console.log(`sigma: ${req.query.sigma}, phie: ${req.query.phie}, tau: ${req.query.tau}`)

  let spawn = require("child_process").spawn

  let process = spawn('python', [
    "./imageCalculateTest.py",
    req.query.sigma,
    req.query.phie,
    req.query.tau
  ])

  process.stdout.on('data', (data) => {
    const parsedString = JSON.parse(data)
    res.json(parsedString)
  })

} 

frontApp.get('/',function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(port, function () {
    console.log('Express app started on ' + port);
});

frontApp.listen(frontPort,function() {
    console.log('Express app started on ' + frontPort);
})
