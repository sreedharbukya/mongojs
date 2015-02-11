module.TemplatedException.extend
(
	module,
	
	function IllegalArgumentException(templatedMessage, formatArguments)
	{
		this.super(IllegalArgumentException, templatedMessage, module.default(formatArguments, {}))
		
		this.hello()
	},
	
	function hello()
	{
		this.supercall(hello, 'world')
	}
)
