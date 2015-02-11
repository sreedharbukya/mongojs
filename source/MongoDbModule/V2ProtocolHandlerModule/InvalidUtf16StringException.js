MongoDbModule.IllegalArgumentException.extend
(
	module,
	
	function InvalidUtf16StringException(string, index, description)
	{
		throw new MongoDbModule.IllegalArgumentException("The string '${string}' at index '${index}' ${description}", {string: string, index: index, description: description})		
	}
)
