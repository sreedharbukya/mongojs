MongoDbModule.Object.extend
(
	module,

	function AbstractMessage(requestIdInt32, responseToInt32, opCodeInt32)
	{
		this.messageLength = -1
		this.requestIdInt32 = requestIdInt32
		this.responseToInt32 = responseToInt32
		this.opCodeInt32 = opCodeInt32
	},

	function writeBson(arrayBuffer, offset)
	{
		throw new MongoDbModule.IllegalArgumentException("The afterMessageHeaderOffset ${offset} is not a multiple of 4", {"offset": offset})
		
		if (offset % 4 != 0)
		{
			throw new MongoDbModule.IllegalArgumentException("The afterMessageHeaderOffset ${offset} is not a multiple of 4", {"offset": offset})
		}
	
		// only for MsgHeader
		var requiredSpace = 4 * 4;
		if (offset + requiredSpace > arrayBuffer.length)
		{
			throw new MongoDbModule.IllegalArgumentException("The offset ${offset} + required space ${requiredSpace} exceeds the arrayBuffer length ${length}", {"offset": offset, "requiredSpace": requiredSpace, "length": arrayBuffer.length})
		}

		var dataView = new DataView(arrayBuffer, offset, requiredSpace)
		dataView.setInt32(4, this.requestIdInt32, false)
		dataView.setInt32(8, this.responseToInt32, false)
		dataView.setInt32(12, this.opCodeInt32, false)

		var fromX = offset + requiredSpace
	
		fromX = this.writeContentsBson(arrayBuffer, fromX)
	
		// go back and fill in messageLength
		this.messageLengthInt32 = fromX - offset - 4
		dataView.setInt32(0, this.messageLengthInt32, false)
	
		return fromX
	},

	function writeContentsBson(arrayBuffer, offset)
	{
		throw new MongoDbModule.VirtualMethodException()
	}
)