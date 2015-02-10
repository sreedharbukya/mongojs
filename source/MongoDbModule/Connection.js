module.protocolHandlers = module.protocolHandlers || {}

module.Connection = function Connection(url)
{
	var protocols = Object.keys(MongoDbModule.protocolHandlers)
	
	var webSocket = new WebSocket(url, protocols)
	webSocket.binaryType = 'arraybuffer' // or 'Blob'
	
	webSocket.onopen = (function(connection)
	{
		// inside an event, 'this' is... the webSocket
		return function(event)
		{
			console.log('open')
			
			connection.protocolHandler = MongoDbModule.protocolHandlers[connection.webSocket.protocol]

			connection.webSocket.send("hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world")
			
			// login, send any pending data, notify the client we're ready for business, etc
		}
	})(this);
	
	webSocket.onmessage = (function(connection)
	{
		return function(messageEvent)
		{
			console.log(messageEvent)
		}
	})(this);

	//this.webSocket.onclose = 
	webSocket.onerror = (function(connection)
	{
		return function(event)
		{
			console.log(event)
			console.log('error')	
		}
	})(this);

	this.webSocket = webSocket
}