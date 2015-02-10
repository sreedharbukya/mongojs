module.Object.extend
(
	function BaseClass(message, int)
	{
		Object.$.constructor.call(this)
		console.log("BaseClass ctor:" + message + ":" + int)
	},
	
	function getName(arg)
	{
		return getName.className + ':' + arg
	},
	
	function getId()
	{
		return 1
	}
)

module.BaseClass.extend
(
	function SubClass(message)
	{
		this.super(SubClass, message, 45)
		// or BaseClass.$.constructor.call(this, message, 45)
		console.log("SubClass ctor:" + message)
	},
	
	{
		field: "I'm a field"
	},
	
	function getName()
	{
		var supercallResult = this.supercall(getName, 'hello')
		// or getName.$.getName.call(this, 'hello')  - this syntax allows access to any method, not just getName
		return "SubClass(" + this.getId() + ") extends " +   this.supercall(getName)
	},

	function getId()
	{
		return 2;
	}
)

module.SubClass.extend
(
	function TopClass()
	{
		SubClass.$.constructor.call(this, "hello")
	},
	
	function getName()
	{
		//Calls the getName() method of SubClass
		return "TopClass(" + this.getId() + ") extends " + getName.$.getName.call(this) + getName.$.field
	},
	
	function getId()
	{
		return arguments.callee.$.getId.call(this);
	}
)

console.log(new module.TopClass().getName())
