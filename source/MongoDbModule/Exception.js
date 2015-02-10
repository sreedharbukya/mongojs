MongoDbModule.Object.extend
(
	module,
	
	function Exception(message)
	{
		Exception.$.constructor.call(this)
		this.name = this.constructor.className
		this.message = message
	},
	
	function toString()
	{
		return this.message
	}
)
