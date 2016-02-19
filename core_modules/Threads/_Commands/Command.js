module.exports = (function(){
  function CreateThreadCommands()
  {
    var _thread = function(){};

    function ThreadCommands()
    {
      return {
        thread_start:ThreadCommands.thread_start,
        echo:ThreadCommands.echo
      }
    }

    ThreadCommands.thread = function(t)
    {
      if(t === undefined)
      {
        return _thread;
      }
      _thread = (typeof t === 'function' ? t : _thread);
      return ThreadCommands;
    }

    /* Method Commands */

    ThreadCommands.thread_start = function(data)
    {
      if(ThreadCommands.thread().status() !== 'online')
      {
        process.send({command:'echo',data:{message:'Started: Thread: '+data.id+' PID: '+process.pid}});
        process.once('uncaughtException',ThreadCommands.thread().exception());
        process.on('message',ThreadCommands.thread().comm());
        process.on('error',function(msg){console.log('ERR,',msg,' From Thread '+ThreadCommands.thread().id());})
        process.once('disconnect',function(){
          process.kill(process.pid);
        });
        process.commands = ThreadCommands.thread().comm().commands();
        ThreadCommands.thread().status('online');
      }
    }

    ThreadCommands.echo = function(data)
    {
      if(data.message !== undefined)
      {
        console.log('From thread '+ThreadCommands.thread().id()+': '+data.message);
      }
    }

    return ThreadCommands;
  }
  return CreateThreadCommands;
}());
