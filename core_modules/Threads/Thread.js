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

    function Thread()
    {
      if(Thread.controller() === 'thread'){
        /* Setup Events for the process */
        console.log('Started: Thread: '+Thread.id(),process.pid);
        process.on('uncaughtException',Thread.exception());
        process.on('message',Thread.comm());
        process.on('error',function(msg){console.log('ERR,',msg,' From Thread '+Thread.id());})
        process.on('disconnect',function(){
          console.log('killing: Thread: '+Thread.id(),process.pid);
          process.kill(process.pid);
        });

        Thread.comm()
        .type('thread')
        .channels('master',function(message){process.send(message)})
        .commands()
        .list(CreateThreadCommands().thread(Thread)());

        /* Testing Messages */
        process.send({command:'echo',data:{message:'echo from thread: '+Thread.id()}});
        //process.send({command:'restart',data:{type:'thread',id:Thread.id()}});
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
      return function(){
        console.log('ERRRRR');
        //send error as well, later for modules
        process.send({command:'crash',data:{type:'thread',id:Thread.id()}});
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
  .modules(JSON.parse(process.env.modules))()
}
else
{
  module.exports = thread;
}
