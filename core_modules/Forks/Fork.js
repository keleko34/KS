var comm_module = require('./../Comm/Comm')
  , fork_commands_module = require('./_Commands/Command')

module.exports = (function(CreateComm,CreateForkCommands){
  function CreateFork()
  {
    var _id = 0
      , _status = 'offline'
      , _statusEnum = ['offline','online','exception']
      , _cluster = {}
      , _master = {}
      , _comm = CreateComm()
      , _http = {listen:function(){},stop:function(){}}
      , _https = {listen:function(){},stop:function(){}}

    function Fork()
    {
      Fork.comm()
      .type('fork')
      .commands()
      .list(CreateForkCommands().fork(Fork)());

      Fork.comm().commands().list('fork_start')({id:Fork.id(),status:Fork.status()});

      Fork.comm().commands().list('server_start')({id:Fork.id(),status:Fork.status()});
    }

    Fork.id = function(i)
    {
      if(i === undefined)
      {
        return _id;
      }
      _id = ((typeof i === 'number' || !isNaN(parseInt(i,10))) ? parseInt(i,10) : _id);
      return Fork;
    }

    Fork.status = function(s)
    {
      if(s === undefined)
      {
        return _status;
      }
      _status = (_statusEnum.indexOf(s) > -1 ? s : _status);
      return Fork;
    }

    Fork.cluster = function(c)
    {
      if(c === undefined)
      {
        return _cluster;
      }
      _cluster = (typeof c === 'object' ? c : _cluster);
      return Fork;
    }

    Fork.master = function(m)
    {
      if(m === undefined)
      {
        return _master;
      }
      _master = (m === process ? m : _master);
      return Fork;
    }

    Fork.comm = function(c)
    {
      if(c === undefined)
      {
        return _comm;
      }
      _comm = (typeof c === 'function' ? c : _comm);
      return Fork;
    }

    Fork.http = function(h)
    {
      if(h === undefined)
      {
        return _http;
      }
      _http = (typeof h === 'function' ? h : _http);
      return Fork;
    }

    Fork.https = function(h)
    {
      if(h === undefined)
      {
        return _https;
      }
      _https = (typeof h === 'function' ? h : _https);
      return Fork;
    }

    Fork.exception = function()
    {
      return function(err){
        Fork.comm().commands().list('log_error')({err:err.message,stack:err.stack});
        process.send({command:'crash',data:{type:'fork',id:Fork.id()}});
        //send error as well, later for modules
        if(process.env.debug !== "false")
        {
          console.error('ERR: \033[31m',err.stack,"\033[37m");
        }
      }
    }

    Fork.shutdown = function()
    {
      Fork.cluster().disconnect();
      return Fork;
    }
    return Fork;
  }
  return CreateFork;
}(comm_module,fork_commands_module))
