PackageLoaderModule.loadPackage
(
	'js/',
	'mongojs',
	function()
	{
		var connection = new MongoDbModule.Connection('ws://localhost:8081/mongodb/')		
	}
)
