MongoDbModule.Exception.extend
(
	module,
	
	function VirtualMethodException()
	{
		VirtualMethodException.$.constructor.call(this, 'This is a virtual method that should have been overridden')
	}
)
