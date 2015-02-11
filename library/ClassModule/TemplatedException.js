module.Exception.extend
(
	module,
	
	function TemplatedException(templatedMessage, formatArguments)
	{
		this.super(TemplatedException, module.template(templatedMessage, module.default(formatArguments, {})))
	},
	
	function hello(msg)
	{
		console.log(msg)
	}
)
