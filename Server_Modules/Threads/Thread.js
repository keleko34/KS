module.exports = (function(){
  function CreateThread()
  {
    var _id = 0
      , _modules = {}
      , _state = 'offline'
      , _stateEnum = ['offline','online','exception']
    
    function Thread(moduleList)
    {
      
    }
    
    Thread.id = function(i)
    {
      if(i === undefined)
      {
        return _id;
      }
      _id = ((typeof i === 'number' || !isNaN(parseInt(i,10))) ? parseInt(i,10) : _id);
      return Thread;
    }
    
    Thread.shutdown = function()
    {
      
    }
    
    return Thread;
  }
  return CreateThread;
}())
