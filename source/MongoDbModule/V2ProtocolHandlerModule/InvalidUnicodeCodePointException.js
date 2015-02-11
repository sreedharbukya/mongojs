ClassModule.IllegalArgumentException.extend
(
	module,
	
	function InvalidUnicodeCodePointException(invalidUnicodeCodePoint, description)
	{
		this.super(InvalidUnicodeCodePointException, "The unicode code point '${invalidUnicodeCodePoint}' ${description}", {invalidUnicodeCodePoint: invalidUnicodeCodePoint, description: description})
	}
)
