var comm_module = require('./../Comm/Comm')

module.exports = (function(CreateComm){
  function CreateFork()
  {
    var _id = 0
      , _status = 'offline'
      , _statusEnum = ['offline','online','exception']
      , _cluster = {}
      , _master = {}
      , _config;
    
    function Fork()
    {
      console.log('started Fork: '+Fork.id());
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
      _cluster = (c.constructor === Object ? c : _cluster);
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

    Fork.shutdown = function()
    {
      Fork.cluster().disconnect();
      return Fork;
    }
    return Fork; 
  }
  return CreateFork;
}(comm_module))
