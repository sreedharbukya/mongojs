MongoDbModule.Object.extend
(
	module,

	function AbstractMessage(requestIdInt32, responseToInt32, opCodeInt32)
	{
		this.messageLengthInt32 = -1
		this.requestIdInt32 = requestIdInt32
		this.responseToInt32 = responseToInt32
		this.opCodeInt32 = opCodeInt32
	},

	function writeBson(writer)
	{
		var messageLengthOffset = writer.skipInt32()
		writer.writeInt32(this.requestIdInt32)
		writer.writeInt32(this.responseToInt32)
		writer.writeInt32(this.opCodeInt32)
		
		var fromX = offset + requiredSpace
		fromX = this.writeContentsBson(arrayBuffer, fromX)
	
		// go back and fill in messageLength
		var messageLengthInt32 = fromX - offset - 4
		writer.setInt32At(messageLengthOffset, messageLengthInt32)
		this.messageLengthInt32 = messageLengthInt32
	
		return fromX
	},

	function writeContentsBson(arrayBuffer, offset)
	{
		throw new MongoDbModule.VirtualMethodException()
	}
)