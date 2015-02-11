MongoDbModule.IllegalArgumentException.extend
(
	module,
	
	function BsonWriterOverflowException(offset, requiredSpace, maximumLength)
	{
		throw new MongoDbModule.IllegalArgumentException("The offset ${offset} + required space ${requiredSpace} exceeds the maximum length ${maximumLength}", {offset: offset, requiredSpace: requiredSpace, length: maximumLength})		
	}
)
