var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

AWS.config.update({accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SECRET});
AWS.config.update({region: 'us-east-1'});

var lambda = new AWS.Lambda();

router.get('/', function(req, res) {
  var params = {
    FunctionName: 'rmb-lambda-w-monitor', /* required */
    InvokeArgs: JSON.stringify({
      value: 0
    }) /* required */
  };
  lambda.invokeAsync(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      res.status(500).send("oops!");
    } else {
      console.log(data);           // successful response
      res.send("ok!"); 
    }
  });
});

module.exports = router;
