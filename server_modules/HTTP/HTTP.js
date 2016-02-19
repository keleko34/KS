module.exports = (function(){
  function CreateHTTP()
  {
    var _port = 8080
      , _base = './app'
      , _status = 'offline'
      , _statusEnum = ['online','offline']
      , _server = {listen:function(){},stop:function(){}};

    function HTTP()
    {
      if(HTTP.status() === 'online')
      {
        HTTP.server()
        .listen(HTTP.port(),undefined,undefined,function(){process.send({command:'echo',data:{message:'HTTP: Started: Port: '+HTTP.port()}})})
      }
      else
      {
        HTTP.server()
        .close(function(){process.send({command:'echo',data:{message:'HTTP: Stopped: Port: '+HTTP.port()}})});
      }
    }

    HTTP.port = function(p)
    {
      if(p === undefined)
      {
        return _port;
      }
      _port = ((typeof p === 'number' || !isNaN(parseInt(p,10))) ? parseInt(p,10) : _port);
      return HTTP;
    }

    HTTP.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = ((typeof b === 'string' && b.indexOf('.') === 0) ? b : _base);
      return HTTP;
    }

    HTTP.status = function(s)
    {
      if(s === undefined)
      {
        return _status;
      }
      _status = (_statusEnum.indexOf(s) > -1 ? s : _status);
      return HTTP;
    }

    HTTP.server = function(s)
    {
      if(s === undefined)
      {
        return _server;
      }
      _server = (typeof s === 'object' && typeof s.listen === 'function' && typeof s.close === 'function' ? s : _server);
      return HTTP;
    }

    return HTTP;
  }
  return CreateHTTP;
}());
