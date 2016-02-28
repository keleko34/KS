var comm_module = require('./../Comm/Comm')
  , thread_command_module = require('./_Commands/Command')

var thread = (function(CreateComm,CreateThreadCommands){
  function CreateThread()
  {
    var _id = 0
      , _modules = {}
      , _fork = {}
      , _master = process
      , _status = 'offline'
      , _statusEnum = ['offline','online','exception']
      , _controller = 'master'
      , _controllerEnum = ['master','thread']
      , _comm = CreateComm()
      , _base = ''

    function Thread()
    {
      if(Thread.controller() === 'thread'){
        /* Setup Events for the comm */
        Thread.comm()
        .type('thread')
        .commands()
        .list(CreateThreadCommands().thread(Thread)())
        .list('thread_start')({id:Thread.id(),status:Thread.status(),modules:Thread.modules(),base:Thread.base()});
      }
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

    Thread.status = function(s)
    {
      if(s === undefined)
      {
        return _status;
      }
      _status = (_statusEnum.indexOf(s) > -1 ? s : _status);
      return Thread;
    }

    Thread.fork = function(f)
    {
      if(f === undefined)
      {
        return _fork;
      }
      _fork = (typeof f === 'object' ? f : _fork);
      return Thread;
    }

    Thread.master = function(m)
    {
      if(m === undefined)
      {
        return _master;
      }
      _master = (m === process ? m : _master);
      return Thread;
    }

    Thread.controller = function(c)
    {
      if(c === undefined)
      {
        return _controller;
      }
      _controller = (_controllerEnum.indexOf(c) > -1 ? c : _controller);
      return Thread;
    }

    Thread.modules = function(n,m)
    {
      if(n === undefined)
      {
        return _modules;
      }
      if(m === undefined && n.constructor === Object)
      {
        _modules = n;
        return Thread;
      }
      var modName = ((typeof n === 'string' || n.toString() !== '[object Object]') ? n.toString() : 'default');
      _modules[modName] = ((m.constructor === Object && m.path !== undefined) ? m : {size:0,path:null});
      if(_modules[modName].size === undefined)
      {
        /* fetch file size */
      }
      return Thread;
    }

    Thread.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = ((typeof b === 'string' && b.indexOf('./') > -1) ? b : _base);
      return Thread;
    }

    Thread.comm = function(c)
    {
      if(c === undefined)
      {
        return _comm;
      }
      _comm = (typeof c === 'function' ? c : _comm);
      return Thread;
    }

    /* Methods */
    Thread.shutdown = function()
    {
      Thread.fork().disconnect();
      return Thread;
    }

    Thread.exception = function()
    {
      return function(err){
        process.send({command:'log_error',route:'fork',data:{err:err.message,stack:err.stack}});
        process.send({command:'crash',data:{type:'thread',id:Thread.id()}});
        if(process.env.debug !== "false")
        {
          console.error('ERR: \033[31m',err.stack,"\033[37m");
        }
      }
    }

    return Thread;
  }
  return CreateThread;
}(comm_module,thread_command_module))

if(process.env.controller !== undefined)
{
  thread()
  .id(process.env.id)
  .controller(process.env.controller)
  .modules(JSON.parse(process.env.site).site_modules.modules)
  .call(process)
}
else
{
  module.exports = thread;
}
