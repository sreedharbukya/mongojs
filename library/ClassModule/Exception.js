module.Object.extend
(
	module,
	
	function Exception(message)
	{
		this.super(Exception)
		this.name = this.constructor.className
		this.message = message
	},
	
	function toString()
	{
		return this.message
	}
)
