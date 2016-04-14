module.exports = (function(){
  function CreateProcessCommands()
  {
    var _module = {commands:function(){}}
      , _env = 'master'
      , _envEnum = ['master','thread','fork']

    function KSProcess = function()
    {

    }

    KSProcess.module = function(v)
    {
      if(v === undefined)
      {
        return _module;
      }
      _module = (typeof v === 'function' && typeof v.commands === 'function' ? v : _module);
      return KSProcess;
    }

    ksprocess.env = function(v)
    {
      if(v === undefined)
      {
        return _env;
      }
      _env = (_envEnum.indexOf(v) > -1 ? v : _env);
      return KSProcess;
    }

    KSProcess.base = function()
    {
      var base = process.cwd().replace(/\\/g,'/');
      return (base.lastIndexOf('/') !== (base.length-1) ? base : base.substring(0,(base.length-1)));
    }

    KSProcess.killAll = function()
    {
      _module.commands('killAll');
    }

    KSProcess.send = function(msg)
    {
      process.send(msg);
    }

    return KSProcess;
  }
  return CreateProcessCommands;
}());