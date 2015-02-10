MongoDbModule.TemplatedException.extend
(
	module,
	
	function IllegalArgumentException(templatedMessage, formatArguments)
	{
		this.super(IllegalArgumentException, templatedMessage, formatArguments)
		
		this.hello()
	},
	
	function hello()
	{
		this.supercall(hello, 'world')
	}
)
