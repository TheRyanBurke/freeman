var freeman = angular.module('freeman',[]);

freeman.controller('FreemanController', ['$scope', '$http', function($scope, $http) {
  $scope.messages = []; 
  $scope.graph = [];
  for(var i = 0; i < 20; i++) {
    $scope.graph.push([]);
    for(var j = 0; j < 10; j++) {
      $scope.graph[i].push({
        id: 10*i+j,
        class: 'none',
        value: 10*i+j
      }); 
    }
  }
  
  $scope.getLambda = function() {
    $http.get('/lambda');
  };
  
  var getClientFromPool = function(poolSize, prefix) {
    var pick = Math.floor((Math.random() * poolSize) + 1);
    prefix = prefix || "client";

    var clientId = prefix.concat(pick);

    return clientId; // e.g. "client74"
  };
  // called when the client connects
  $scope.onConnect = function () {
    // Once a connection has been made, make a subscription
    console.log("onConnect");
    $scope.messages.unshift("connected!");
    $scope.$apply();
    $scope.client.subscribe("1d6f237e609bed7c5d785f24d812354d/lambdas/monitor");
  };

  // called when the client loses its connection
  var onConnectionLost = function(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
      $scope.messages.unshift('disconnected. reconnecting...');
      $scope.$apply();
      $scope.client = new Paho.MQTT.Client('q.thingfabric.com', 4483, getClientFromPool(200,"freeman"));
      $scope.client.connect({
        userName: '35aff195-7c44-4114-a8aa-b2f2c2655f11',
        password: '38206345759dae24e069ff101de701b9',
        useSSL: true,
        onSuccess:$scope.onConnect
      });
    }
  };

  // called when a message arrives
  var onMessageArrived = function(message) {
    console.log("onMessageArrived:"+message.payloadString);
    $scope.messages.unshift(message.payloadString);
    try {
      var payload = JSON.parse(message.payloadString);
      if(payload.id) {
        var cell = parseInt(payload.id.split('lambda')[1]);
        var i = Math.floor(cell/10);
        var j = cell%10;
        var status = payload.status.split(' ')[0];
        var node = $scope.graph[i][j];
        node.value = status;
        
        if(status === 'done') {
          node.class = 'finish';
          setTimeout(function() {
            node.value = 10*i+j;
            node.class = 'none';
            $scope.$apply();
          }, 3000);
        } else {
          node.class = 'active';
        }
        
        $scope.$apply();
      }
    } catch(e) {
    
    }
    $scope.$apply();
  };

  // Create a client instance
  $scope.client = new Paho.MQTT.Client('q.thingfabric.com', 4483, getClientFromPool(200,"freeman"));

  // set callback handlers
  $scope.client.onConnectionLost = onConnectionLost;
  $scope.client.onMessageArrived = onMessageArrived;

  // connect the client
  $scope.client.connect({
    userName: '35aff195-7c44-4114-a8aa-b2f2c2655f11',
    password: '38206345759dae24e069ff101de701b9',
    useSSL: true,
    onSuccess:$scope.onConnect
  });


  
  
}]);

