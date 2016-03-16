module.exports = (function(){
  function CreateThread()
  {
    var _id = ''
      , _modules = {}
      , _moduleList = []
      , _process = {}

    function Thread()
    {

    }

    Thread.id = function(v)
    {

    }

    Thread.modules = function(v)
    {

    }

    Thread.moduleList = function()
    {
      return _moduleList;
    }

    Thread.addModule = function(v)
    {

    }

    Thread.removeModule = function(v)
    {

    }

    Thread.environment = function(v)
    {

    }

    Thread.process = function()
    {
      return (process.send !== undefined ? process : _process);
    }


    return Thread;
  }
  return CreateThread;
}());
