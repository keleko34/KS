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
      , _config
      , _comm = CreateComm()
      , _http = {listen:function(){},stop:function(){}}
      , _https = {listen:function(){},stop:function(){}}

    function Fork()
    {
      Fork.comm()
      .type('fork')
      .channels('master',function(message){process.send(message)})
      .commands()
      .list(CreateForkCommands().fork(Fork)());

      Fork.comm().commands().list('fork_start')({id:Fork.id(),status:Fork.status(),config:Fork.config()});

      Fork.comm().commands().list('server_start')({id:Fork.id(),status:Fork.status(),config:Fork.config()});
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

    Fork.config = function(c)
    {
      if(c === undefined)
      {
        return _config;
      }
      _config = (c.constructor === Object ? c : _config);
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
        console.log('ERR: ',err);
        //send error as well, later for modules
        process.send({command:'crash',data:{type:'fork',id:Fork.id()}});
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
