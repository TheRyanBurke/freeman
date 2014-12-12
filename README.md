# Freeman

Freeman is an AWS Lambda resource monitor which pipes data through 2lemetry ThingFabric.

Second toy project using AWS Lambda.

Blog post here: http://2lemetry.com/2014/12/12/visualizing-aws-lambda-consumption-thingfabric/

## Demo

Currently deployed to Heroku at https://arcane-ocean-9359.herokuapp.com/

Click the "Start a Lambda!" button to launch a Lambda instance in my account. It will run for a random amount of time between 100-3000ms. On launch, it publishes a start message and on close, a termination message.

Messages are sent via HTTP to the ThingFabric API. Those messages are received in real-time by the Paho JS MQTT client running on the page.

### Attribution

* Ryan Burke, 2lemetry (Lambda, middleware)
* Paul Lee, 2lemetry (UI)
