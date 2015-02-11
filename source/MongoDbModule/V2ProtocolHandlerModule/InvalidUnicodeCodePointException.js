MongoDbModule.IllegalArgumentException.extend
(
	module,
	
	function InvalidUnicodeCodePointException(invalidUnicodeCodePoint, description)
	{
		throw new MongoDbModule.IllegalArgumentException("The unicode code point '${invalidUnicodeCodePoint}' ${description}", {invalidUnicodeCodePoint: invalidUnicodeCodePoint, description: description})		
	}
)
