//http://bsonspec.org/spec.html
MongoDbModule.Object.extend
(
	module,

	function BsonWriter(arrayBuffer)
	{
		this.dataView = new DataView(arrayBuffer)
		this.maximumLength = this.dataView.byteLength
		this.offset = 0
	},
	
	function _guardOverflow(offset, requiredSpace)
	{
		var resultantOffset = offset + requiredSpace
		var maximumLength = this.maximumLength
		if (resultantOffset > maximumLength)
		{
			throw new module.WriterOverflowException(offset, requiredSpace, maximumLength)
		}
		return resultantOffset
	},
	
	function skip(count)
	{
		this.offset += count
		return this.offset;
	},
	
	function skipByte()
	{
		return this.skip(1)
	},
	
	function writeByte(value)
	{
		return (this.offset = this.writeByteAt(value, this.offset))
	},
	
	function writeByteAt(value, offset)
	{
		var resultantOffset = this._guardOverflow(offset, 1)
		this.dataView.setInt8(offset, value)
		return resultantOffset
	},
	
	function skipInt32()
	{
		return this.skip(4)
	},
	
	function writeInt32(value)
	{
		return (this.offset = this.writeInt32At(value, this.offset))
	},
	
	function writeInt32At(value, offset)
	{
		var resultantOffset = this._guardOverflow(offset, 4)
		this.dataView.setInt32(offset, value, true)
		return resultantOffset
	},
	
	function skipInt64()
	{
		return this.skip(8)
	},
	
	function writeInt64(value)
	{
		return (this.offset = this.writeInt64At(value, this.offset))
	},
	
	function writeInt64At(value, offset)
	{
		var resultantOffset = this._guardOverflow(offset, 8)
		this.dataView.setInt64(offset, value, true)
		return resultantOffset
	},
	
	function skipDouble()
	{
		return this.skip(8)
	},
	
	function writeDouble(value)
	{
		return (this.offset = this.writeDoubleAt(value, this.offset))
	},
	
	function writeDoubleAt(value, offset)
	{
		var resultantOffset = this._guardOverflow(offset, 8)
		this.dataView.setDouble(offset, value, true)
		return resultantOffset
	},
	
	function _writeUnicodeCodePointAsUtf8(value)
	{
		return (this.offset = this._writeUnicodeCodePointAsUtf8At(value, this.offset))
	},
	
	function _writeUnicodeCodePointAsUtf8At(value, offset)
	{		
		var dataView = this.dataView
		var resultantOffset
		
		if (value < 0x80)
		{
			resultantOffset = this._guardOverflow(offset, 1)
		    dataView.setInt8(offset, value, offset)
		}
		else if (value <= 0x7FF)
		{
			resultantOffset = this._guardOverflow(offset, 2)
		    dataView.setInt8(offset, (code_point >> 6) + 0xC0)
		    dataView.setInt8(offset + 1, (code_point & 0x3F) + 0x80)
		}
		else if (value <= 0xFFFF)
		{
			resultantOffset = this._guardOverflow(offset, 3)
		    dataView.setInt8(offset, (code_point >> 12) + 0xE0)
		    dataView.setInt8(offset + 1, ((code_point >> 6) & 0x3F) + 0x80)
		    dataView.setInt8(offset + 2, (code_point & 0x3F) + 0x80)
		}
		else if (value <= 0x10FFFF)
		{
			resultantOffset = this._guardOverflow(offset, 4)
		    dataView.setInt8(offset, (code_point >> 18) + 0xF0)
		    dataView.setInt8(offset + 1, ((code_point >> 12) & 0x3F) + 0x80)
		    dataView.setInt8(offset + 2, ((code_point >> 6) & 0x3F) + 0x80)
		    dataView.setInt8(offset + 3, (code_point & 0x3F) + 0x80)
		}
		else
		{
			throw new module.InvalidUnicodeCodePointException(value, 'is greater than 0x10FFFFF')
		}
		
		return resultantOffset
	},
	
	function _writeStringWithTrailingNullAt(value, codePointZeroIsInvalid, offset)
	{
		var stringLength = value.length
		var index = 0
		var nextOffset = offset
		var _writeUnicodeCodePointAsUtf8At = this._writeUnicodeCodePointAsUtf8At
		while(index < stringLength)
		{
			var utf16CodePoint = value.charCodeAt(index)
			
			// not a surrogate pair
		    if (utf16CodePoint < 0xD800 || utf16CodePoint > 0xDFFF)
			{
				if (utf16CodePoint == 0 && codePointZeroIsInvalid)
				{
					throw new module.InvalidUtf16StringException(value, index, 'has code point zero (NUL); this is not allowed in the current context')
				}
				nextOffset = _writeUnicodeCodePointAsUtf8At(utf16CodePoint, nextOffset)
				index++
				continue
		    }
			
			// High Surrogate
			if (0xD800 <= utf16CodePoint && utf16CodePoint <= 0xDBFF)
			{
				if (index = stringLength - 1)
				{
					throw new module.InvalidUtf16StringException(value, index, 'has a leading high surrogate but no subsequent low surrogate (there are not more UTF-16 characters)')
				}
				
				var lowSurrogateUtf16CodePoint = value.charCodeAt(index + 1)
				if (0xDC00 > lowSurrogateUtf16CodePoint || lowSurrogateUtf16CodePoint < 0xDBFF)
				{
					throw new module.InvalidUtf16StringException(value, index, 'has a leading high surrogate but no subsequent low surrogate')
				}
				
				nextOffset = _writeUnicodeCodePointAsUtf8((utf16CodePoint << 10) + lowSurrogateUtf16CodePoint - 0x35FDC00, nextOffset)
				
				index +=2
			}
		}
		
		return this.writeByteAt(0, nextOffset)
	},
	
	function _writeStringWithTrailingNull(value, codePointZeroIsInvalid)
	{
		return (this.offset = this._writeStringWithTrailingNullAt(value, codePointZeroIsInvalid, this.offset))
	},

	// 32-bit length (including trailing NUL), UTF-8 bytes, trailing NULL, ASCII NUL allowed
	function writeStringAt(value, offset)
	{
		var lengthStartsFromOffset = offset + 4
		
		var finalOffset = this._writeStringWithTrailingNullAt(value, false, lengthStartsFromOffset)
		
		this.writeInt32At(offset, finalOffset - lengthStartsFromOffset)
		
		return finalOffset
	},
	
	function writeString(value)
	{
		return (this.offset = this.writeStringAt(value, this.offset))
	},
	
	// UTF-8 bytes, trailing NULL, ASCII NUL not allowed
	function writeCstringAt(value, offset)
	{
		return this._writeStringWithTrailingNull(value, true, offset)
	},
	
	function writeCstring(value)
	{
		return (this.offset = this.writeCstringAt(value, this.offset))
	},
	
	// binary 	::= 	int32 subtype (byte*) 	Binary - The int32 is the number of bytes in the (byte*).
	function writeBinaryAt(value, subtype, offset)
	{
		var buffer
		var bufferOffset
		var bufferLength
		if (value instanceof ArrayBuffer)
		{
			buffer = value
			bufferOffset = 0
			bufferLength = value.byteLength
		}
		else if (value instanceof DataView)
		{
			buffer = value.buffer
			bufferOffset = value.byteOffset
			bufferLength = value.byteLength
		}
		else
		{
			buffer = subbtype.buffer
			if (buffer instanceof ArrayBuffer)
			{
				bufferOffset = value.byteOffset
				bufferLength = value.byteLength
			}
			else if (value instanceof Blob || value instanceof File)
			{
				throw new MongoDbModule.IllegalArgumentException("value can not be a Blob or File", {})
				/*
				var reader = new FileReader()
				reader.onloadend = function(event)
				{
					buffer = reader.result
					bufferOffset = 0
					bufferLength = buffer.byteLength
				}
				reader.readAsArrayBuffer(value)
				
				since events aren't asynchronous, there's no way to apuse for the Blob to be read
				*/
				
			}
			// binary string
			else if (value instanceof String || typeof value === 'string')
			{
				
			}
				// Array, Arguments, ?String
		}
		
		// DataView and 
		// TypedArray is NOT a common ancestor for Int32Array et al !
		var 
	},
	
	function writeBinary(value, subtype)
	{
		return (this.offset = this.writeBinaryAt(value, subtype, this.offset))
	}
)

module.BinarySubtypes =
{
	Generic: 0x00,
	Function: 0x01,
	BinaryOld: 0x02,
	UuidOld: 0x03,
	Uuid: 0x04,
	Md5: 0x05,
	UserDefined: 0x80
}

/*
subtype 	::= 	"\x00" 	Generic binary subtype
	| 	"\x01" 	Function
	| 	"\x02" 	Binary (Old)
	| 	"\x03" 	UUID (Old)
	| 	"\x04" 	UUID
	| 	"\x05" 	MD5
	| 	"\x80" 	User defined
/*
element 	::= 	"\x01" e_name double 	Floating point
	| 	"\x02" e_name string 	UTF-8 string
	| 	"\x03" e_name document 	Embedded document
	| 	"\x04" e_name document 	Array
	| 	"\x05" e_name binary 	Binary data
	| 	"\x06" e_name 	Undefined — Deprecated
	| 	"\x07" e_name (byte*12) 	ObjectId
	| 	"\x08" e_name "\x00" 	Boolean "false"
	| 	"\x08" e_name "\x01" 	Boolean "true"
	| 	"\x09" e_name int64 	UTC datetime
	| 	"\x0A" e_name 	Null value
	| 	"\x0B" e_name cstring cstring 	Regular expression - The first cstring is the regex pattern, the second is the regex options string. Options are identified by characters, which must be stored in alphabetical order. Valid options are 'i' for case insensitive matching, 'm' for multiline matching, 'x' for verbose mode, 'l' to make \w, \W, etc. locale dependent, 's' for dotall mode ('.' matches everything), and 'u' to make \w, \W, etc. match unicode.
	| 	"\x0C" e_name string (byte*12) 	DBPointer — Deprecated
	| 	"\x0D" e_name string 	JavaScript code
	| 	"\x0E" e_name string 	Deprecated
	| 	"\x0F" e_name code_w_s 	JavaScript code w/ scope
	| 	"\x10" e_name int32 	32-bit Integer
	| 	"\x11" e_name int64 	Timestamp
	| 	"\x12" e_name int64 	64-bit integer
	| 	"\xFF" e_name 	Min key
	| 	"\x7F" e_name 	Max key
*/