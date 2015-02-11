// Modified from https://gist.github.com/WebReflection/8f227532143e63649804
// Andrea Giammarchi - WTFPL License
// new: accepts a transformer as first argument
// str.template(html, {object:value});
module.template = function template(string, fn, object)
{
	var hasTransformer = typeof fn === 'function'
	var prefix = hasTransformer ? '__tpl' + (+new Date) : ''
	var stringify = JSON.stringify
	var re = /\$\{([\S\s]*?)\}/g
	var evaluate = []
	var i = 0
	var m

	while (m = re.exec(string))
	{
		evaluate.push
		(
			stringify(string.slice(i, re.lastIndex - m[0].length)),
			prefix + '(' + m[1] + ')'
		)
		i = re.lastIndex
	}
	evaluate.push(stringify(string.slice(i)))

	// Function is needed to opt out from possible "use strict" directive
	return Function(prefix, 'with(this)return' + evaluate.join('+')).call(
		hasTransformer ? object : fn, // the object to use inside the with
		hasTransformer && fn          // the optional transformer function to use
	)
}