// Creates a top-level module if does not exist, so allowing parallel loading and code to reside in multiple files and be concatenated in any order
// Additionally, code can be in multiple files
var PackageLoaderModule = (function(module){
	
	var alreadyLoadedPackage = {}
	
	module.loadPackage = function(path, packageName, callbackOnPackageLoaded)
	{
		if (alreadyLoadedPackage.hasOwnProperty(packageName))
		{
			callbackOnPackageLoaded()
			return false
		}
		alreadyLoadedPackage[packageName] = true
			
		var ajax = new XMLHttpRequest()
		ajax.onload = function(event)
		{
			if (ajax.status != 200)
			{
				throw "Could not load package " + packageName
				return false
			}
			
			var topLevelModules = JSON.parse(ajax.responseText)
			var outstanding = topLevelModules.length
			topLevelModules.forEach(function(topLevelModule)
			{
				module.loadModule(path, topLevelModule, function moduleLoaded()
				{
					outstanding -= 1
					if (outstanding == 0)
					{
						callbackOnPackageLoaded()
					}
				})
			})
		}
		
		ajax.open('GET', path + packageName + '.package.json', true)
		ajax.send()
		
		return true
	}
	
	var alreadyLoadedModule = {}
	
	module.loadModule = function(path, moduleName, callbackOnAllScriptsLoaded)
	{
		if (alreadyLoadedModule.hasOwnProperty(moduleName))
		{
			callbackOnAllScriptsLoaded()
			return false
		}
		alreadyLoadedModule[moduleName] = true
			
		var ajax = new XMLHttpRequest()
		ajax.onload = function(event)
		{
			if (ajax.status != 200)
			{
				throw "Could not load module " + moduleName
				return false
			}
			
			var modules = JSON.parse(ajax.responseText)
			loadModulesFromRoot(path, modules, callbackOnAllScriptsLoaded)
		}
		
		ajax.open('GET', path + moduleName + '/module.json', true)
		ajax.send()
		
		return true
	}
	
	function loadModulesFromRoot(path, modules, callbackOnAllScriptsLoaded)
	{
		var scriptNodes = []
		
		scriptNodes.path = path
		
		scriptNodes.callbackOnAllScriptsLoaded = callbackOnAllScriptsLoaded
		
		scriptNodes.remainingToDownload = -1
		
		scriptNodes.loadScript = function loadScript(ourNamespace, fileName)
		{
			var scriptUrl = scriptNodes.path + ourNamespace.join('/') + '/' + fileName + '.js'
		
			var scriptNode = document.createElement('script')
			scriptNode.type = 'text/javascript'
			scriptNode.async = false
			scriptNode.title = scriptUrl
			//scriptNode.src = scriptUrl
		
			var ajax = new XMLHttpRequest()
			scriptNode.ajax = ajax
			ajax.open('GET', scriptUrl, true)
			ajax.onload = function(event)
			{
				if (ajax.status != 200)
				{
					throw "Could not load script from URL " + scriptNode.title
					return false
				}
				
				scriptNode.wrapScriptInModule(ourNamespace, this.responseText)
				scriptNodes.anotherScriptDownloaded()
			}
			
			scriptNode.download = function download()
			{
				ajax.send()
			}
			
			scriptNode.wrapScriptInModule = function wrapScriptInModule(ourNamespace, originalScript)
			{
				// eg MongoDbModule.V2ProtocolHandlerModule
				var globalObject = ourNamespace.join('.')
				
				var descendentNamespace = ourNamespace[ourNamespace.length - 1]

				/*		
					MongoDbModule.V2ProtocolHandlerModule = (function(module){
						<originalScript>
						return module
					}(MongoDbModule.V2ProtocolHandlerModule || {}));
		
					where globalObject == MongoDbModule.V2ProtocolHandlerModule, say
				*/
		
				var script = ''
		
				// top
				var script = script + '// ' + scriptUrl + '\n\n'
				var script = script + '"use strict";\n'
				var script = script + globalObject + ' = (function(module){\n'
		
				// middle
				var script = script + originalScript + '\n'
		
				// bottom
				var script = script + 'return module\n'
				var script = script + '}(' + globalObject + ' || {}));\n'
		
				this.textContent = script
			}
			
			this.push(scriptNode)
		}
		
		scriptNodes.anotherScriptDownloaded = function anotherScriptDownloaded()
		{
			this.remainingToDownload -= 1

			if (this.remainingToDownload == 0)
			{
				var headNode = document.getElementsByTagName('head')[0]
			
				this.forEach(function(orderedScriptNode, index)
				{
					headNode.appendChild(orderedScriptNode)
					delete this[index]
				})
				this.callbackOnAllScriptsLoaded()
			}
		}
		
		scriptNodes.download = function download()
		{
			this.remainingToDownload = this.length
		
			this.forEach(function(scriptNode)
			{
				scriptNode.download()
			})
		}
				
		scriptNodes.loadModulesRecursively = function loadModulesRecursively(parentNamespace, modules)
		{
			for (var moduleName in modules)
			{
				if (!modules.hasOwnProperty(moduleName))
				{
					continue
				}
				
				var ourNamespace = parentNamespace.slice()
				ourNamespace.push(moduleName)
				
				var parentModule = window
				ourNamespace.forEach(function(childModuleName)
				{
					/*
						For index 0, equivalent of:-
				
						var MongoDbModule = (function(module)
						{
							return module
						})(MongoDbModule || {}));
					*/
					/*
						For other indices, equivalent of:-
				
						MongoDbModule.V2ProtocolHandlerModule = (function(module)
						{
							return module
						})(MongoDbModule.V2ProtocolHandlerModule || {});
					*/
					if (parentModule[childModuleName])
					{
						return
					}
					parentModule[childModuleName] = (function(childModuleName)
					{
						return childModuleName
					})(parentModule[childModuleName] || {});
				
					parentModule = parentModule[childModuleName]
				})
				
				var filesOrSubmodules = modules[moduleName]
				var length = filesOrSubmodules.length
				for (var index = 0; index < length; index++)
				{
					var fileOrSubmodule = filesOrSubmodules[index]
					if (typeof fileOrSubmodule == 'object')
					{
						this.loadModulesRecursively(ourNamespace, fileOrSubmodule)
					}
					else
					{
						this.loadScript(ourNamespace, fileOrSubmodule)
					}
				}	
			}
		}
		
		scriptNodes.loadModulesRecursively([], modules)
		
		scriptNodes.download()
	}

	
	
	
	return module
	
}(PackageLoaderModule || {}));
