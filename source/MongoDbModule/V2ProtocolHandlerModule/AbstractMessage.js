ClassModule.Object.extend
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
		var messageLengthOffset = writer.offset
		var lengthStartsFromOffset = writer.skipInt32()
		writer.writeInt32(this.requestIdInt32)
		writer.writeInt32(this.responseToInt32)
		writer.writeInt32(this.opCodeInt32)
		
		this.writeContentsBson(writer)
		
		this.messageLengthInt32 = (messageLengthInt32 = writer.offset - lengthStartsFromOffset)
		writer.writeInt32At(messageLengthOffset, messageLengthInt32)
	},

	function writeContentsBson(writer)
	{
		throw new ClassModule.VirtualMethodException()
	}
)