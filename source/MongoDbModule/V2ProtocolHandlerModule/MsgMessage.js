(module.OpCodes = module.OpCodes || {}).OP_MSG = 1000

module.AbstractMessage.extend
(
	module,

	function MsgMessage(requestIdInt32, responseToInt32, messageCstring)
	{
		MsgMessage.$.constructor.call(this, requestIdInt32, responseToInt32, module.OpCodes.OP_MSG)
	
		this.messageCstring = messageCstring
	},
	
	function writeContentsBson(arrayBuffer, offset)
	{
		var newOffset = this.messageCstring.writeBson(arrayBuffer, offset)
		return newOffset
	}
)