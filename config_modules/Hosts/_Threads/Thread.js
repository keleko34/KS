module.exports = (function(){
  function CreateThread()
  {
    var _id = ''
      , _modules = {}
      , _moduleList = []
      , _process = {}
      , _environment = 'master'
      , _environmentEnum = ['master','thread']
      , _onMasterCall = function(){}
      , _onThreadCall = function(){}

    function Thread()
    {
      if(_environment === 'master')
      {
        _onMasterCall(Thread);
      }
      else
      {
        _onThreadCall(Thread);
      }
    }

    Thread.id = function(v)
    {
      if(v === undefined)
      {
        return _id;
      }
      _id = (typeof v === 'string' ? v : _id);
      return Thread;
    }

    Thread.modules = function(v)
    {
      if(v === undefined)
      {
        return _modules;
      }
      _modules = (typeof v === 'object' ? v : _modules);
      _moduleList = Object.keys(_modules);
      return Thread;
    }

    Thread.moduleList = function()
    {
      return _moduleList;
    }

    Thread.addModule = function(v,active)
    {
      if(typeof v === 'string')
      {
        _modules[v] = !!active;
        _moduleList = Object.keys(_modules);
        Thread.call();
      }
    }

    Thread.removeModule = function(v)
    {
      if(typeof v === 'string')
      {
        _modules[v] = null;
        delete _modules[v];
        _moduleList = Object.keys(_modules);
        Thread.call();
      }
    }

    Thread.environment = function(v)
    {
      if(v === undefined)
      {
        return _environment;
      }
      _environment = (_environmentEnum.indexOf(v) > -1 ? v : _environment);
      return Thread;
    }

    Thread.process = function(v)
    {
      if(typeof v === undefined)
      {
        return (process.send !== undefined ? process : _process);
      }
      _process = (typeof v === 'object' ? v : _process);
      return Thread;
    }

    Thread.onMasterCall = function(v)
    {
      if(v === undefined)
      {
        return _onMasterCall;
      }
      _onMasterCall = (typeof v === 'function' ? v : _onMasterCall);
      return Thread;
    }

    Thread.onThreadCall = function(v)
    {
      if(v === undefined)
      {
        return _onThreadCall;
      }
      _onThreadCall = (typeof v === 'function' ? v : _onThreadCall);
      return Thread;
    }

    return Thread;
  }
  return CreateThread;
}());
