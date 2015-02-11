ClassModule.IllegalArgumentException.extend
(
	module,
	
	function InvalidUtf16StringException(string, index, description)
	{
		this.super(InvalidUtf16StringException, "The string '${string}' at index '${index}' ${description}", {string: string, index: index, description: description})
	}
)
