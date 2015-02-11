ClassModule.IllegalArgumentException.extend
(
	module,
	
	function BsonWriterOverflowException(offset, requiredSpace, maximumLength)
	{
		this.super(BsonWriterOverflowException, "The offset ${offset} + required space ${requiredSpace} exceeds the maximum length ${maximumLength}", {offset: offset, requiredSpace: requiredSpace, length: maximumLength})
	}
)
