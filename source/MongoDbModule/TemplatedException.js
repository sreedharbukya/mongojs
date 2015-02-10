MongoDbModule.Exception.extend
(
	module,
	
	function TemplatedException(templatedMessage, formatArguments)
	{
		this.super(TemplatedException, MongoDbModule.template(templatedMessage, formatArguments))
	},
	
	function hello(msg)
	{
		console.log(msg)
	}
)
