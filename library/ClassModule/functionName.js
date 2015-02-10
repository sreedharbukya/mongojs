module.functionName = function functionName(func)
{
	// In ECMAScript 6, we can use klass = constructor.name
	if (func.name)
	{
		var klass = func.name
	}
	else
	{
		// For now, we use a conversion to source and a regex. Yuck.
		var klass = /^function\s+([\w\$]+)\s*\(/.exec( func.toString() )[ 1 ]
	}
	
	return klass
}