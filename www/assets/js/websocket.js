var Websocket = new Vue({
  el: '#dashboard_websocket',
  data: {
	webapi: null,
  	client: null,
  	connState : false,
  	cInfo : {
    	host : location.hostname,
      port : 8083,
      clientId : 'C_' + new Date().getTime(),
      userName : null,
      password : null,
      keepAlive: null,
      cleanSession : true,
      useSSL : false 
  	},
    subInfo : {
   		topic : 'world',
    	qos : 0
    },
    subscriptions : [],
    sendInfo : {
    	topic : 'world',
      text : 'Hello world!',
      qos : 0,
      retained : true
		},
    sendMsgs : [],
    receiveMsgs : []
  },
	computed: {
	  reverseReceiveMsgs: function() {
			return this.receiveMsgs.reverse();
  	},
	},
  methods: {
    show: function() {
      this.$el.style.display = 'block';
		  if (this.client && !this.client.isConnected()) {
		    this.disconnect();
			}
    },
    hide: function() {
      this.$el.style.display = 'none';
    },
    clear: function() {
      this.pageInfo = new PageInfo(1, 100, 0);
      this.topic = null;
    },
		connect : function() {
			var _this = this;
    	_this.newClient();
	    if (!_this.client) {
  	    return;
    	}
    	// called when the client loses its connection
    	_this.client.onConnectionLost = function(responseObject) {
    	  if (responseObject.errorCode !== 0) {
      		console.log("onConnectionLost: " + responseObject.errorMessage);
    		}
      	_this.disconnect();
    	}
    	// called when a message arrives
    	_this.client.onMessageArrived = function(message) {
        // console.log("onMessageArrived: " + message.payloadString);
        message.arrived_at = (new Date()).format("yyyy-MM-dd hh:mm:ss");
        try {
      	  message.msgString = message.payloadString;
        } catch (e) {
        	message.msgString = "Binary message(" +  message.payloadBytes.length + ")";
        }
        _this.receiveMsgs.push(message);
    	}
    	var options = {
      	onSuccess : function() {
        	console.log("The client connect success.");
          _this.connState = true;
        },
        onFailure : function(err) {
        	alert("The client connect failure " + err.errorMessage);  
          // console.log("==========." + err.errorMessage);
          // console.log("==========." + JSON.stringify(err));
          // console.log("The client connect failure.");
          _this.connState = false;
        }
	    };
  	  var userName = _this.cInfo.userName;
    	var password = _this.cInfo.password;
    	var keepAlive = _this.cInfo.keepAlive;
    	var cleanSession = _this.cInfo.cleanSession;
    	var useSSL = _this.cInfo.useSSL;
    	if (userName) {
        options.userName = userName;
    	}
    	if (password) {
      	options.password = password;
    	}
    	if (keepAlive) {
      	options.keepAliveInterval = Number(keepAlive);
    	}
    	options.cleanSession = cleanSession;
    	options.useSSL= useSSL;
    	_this.client.connect(options);
    },
    disconnect : function() {
    	if (this.client && this.client.isConnected()) {
      	this.client.disconnect();
        this.client = null;
			}
	    console.log("The client disconnect success.");
  	  _this.connState = false;
		},
    subscribe: function() {
			var _this = this;
    	if (!_this.client || !_this.client.isConnected()) {
        alert('The client does not connect to the broker');
        return;
    	}
    	if (!_this.subInfo.topic) {
        alert('Please fill in the topic.');
        return;
    	}
    	this.client.subscribe(_this.subInfo.topic, {
        qos : Number(_this.subInfo.qos),
        onSuccess : function(msg) {
      	  console.log(JSON.stringify(msg));
        	_this.subInfo.time = (new Date()).format("yyyy-MM-dd hh:mm:ss");
          _this.subscriptions.push(_this.subInfo);
          _this.subInfo = {qos : _this.subInfo.qos};
      	},
        onFailure : function(err) {
        	if (err.errorCode[0] == 128) {
          	alert('The topic cannot SUBSCRIBE for ACL Deny');
            console.log(JSON.stringify(err));
          }
        }
    	});
		},
		newClient: function() {
			this.client = new Paho.MQTT.Client(
      this.cInfo.host,
      Number( this.cInfo.port ),
      this.cInfo.clientId);
		},
    unsubscribe: function() {
			var _this = this;
    	if (!_this.client || !_this.client.isConnected()) {
      	alert('The client does not connect to the broker');
        return;
    	}
    	if (!_this.subInfo.topic) {
      	alert('Please fill in the topic.');
        return;
    	}
    	this.client.unsubscribe(_this.subInfo.topic, {
      	onSuccess : function(msg) {
        	console.log(JSON.stringify(msg));
          _this.subInfo = {qos : _this.subInfo.qos};
        },
        onFailure : function(err) {
        	console.log(JSON.stringify(err));
        }
    	});
    },
    sendMessage : function() {
			var _this = this;
    	var text = _this.sendInfo.text;
    	if (!_this.client || !_this.client.isConnected()) {
      	alert('The client does not connect to the broker');
        return;
    	}
    	if (!_this.sendInfo.topic) {
        alert('Please fill in the message topic.');
        return;
    	}
    	if (!text) {
        alert('Please fill in the message content.');
        return;
    	}
    	var message = new Paho.MQTT.Message(text);
    	message.destinationName = _this.sendInfo.topic;
    	message.qos = Number(_this.sendInfo.qos);
    	message.retained = _this.sendInfo.retained;
    	_this.client.send(message);
    	_this.sendInfo.time = (new Date()).format("yyyy-MM-dd hh:mm:ss");
    	_this.sendMsgs.push(this.sendInfo);
    	_this.sendInfo = {
      	topic : _this.sendInfo.topic,
      	qos : _this.sendInfo.qos,
      	retained : _this.sendInfo.retained};

		},
    sslPort :function() {
	  	var useSSL = this.cInfo.useSSL;
    	if (useSSL) {
      	this.cInfo.port = 8084
    	} else {
      	this.cInfo.port = 8083
    	}
    }
  },
  mounted: function() {
    this.webapi = WebAPI.init({
      callback : function() {
        // sog.mainFooter.toBottom();
      }
    });
  }
});
