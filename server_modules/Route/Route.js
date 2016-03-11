var filter_module = require('./_Filter/Filter')
  , send_module = require('./_Send/Send');

module.exports = (function(CreateFilter,CreateSend){
  function CreateRoute()
  {
    var _pipeOrder = ['file','module','directory','error']
      , _url =''
      , _ext = ''
      , _base ='/app'
      , _fileName = ''
      , _dir = ''
      , _query = {}
      , _config = {}
      , _host = ''
      , _location = process.cwd().replace(/\\/g,"/")
      , _ip = ''
      , _protocol = 'http'
      , _protocolEnum = ['http','https']
      , _port = 8080
      , _throwError = 200

    function Route(res)
    {
      var _alias = CreateFilter().type('alias').call(Route)
        , _env = CreateFilter().type('env').call(Route)
        , _vhost = CreateFilter().type('vhost').call(Route)
        , _firewall = (_vhost ? (config.sites[Route.host()].app.firewall ? CreateFilter().type('firewall').call(Route) : true) : false)
        , _error = function(stream,code){
              var _send = CreateSend()
              .host(Route.host())
              .ext('html')
              .stream(true)
              .content(stream)
              .error(code)
              .call(Route,res);
          }
        , _pipe = function(stream,ext){
                var _send = CreateSend()
                .host(Route.host())
                .location(Route.protocol()+"://"+Route.host()+((Route.port() !== 80 && Route.port() !== 443) ? (":"+Route.port()) : "")+Route.base()+Route.url())
                .ext(ext)
                .stream(true)
                .error(200)
                .content(stream)
                .call(Route,res);
          }
        , _createError = function(err)
          {
            CreateFilter().type('error').statusCode(err).error(_error).call(Route);
          }

      if(Route.throwError() !== 200)
      {
        if(process.env.debug !== "false")
        {
          console.error('Throwing Request Error: Request Module: \033[31m',Route.host(),Route.base(),Route.url(),"\033[37m");
        }
        _createError(Route.throwError());
      }
      else if(!_vhost)
      {
        if(process.env.debug !== "false")
        {
          console.error('VHOST not found: Request Module: \033[31m',Route.host(),Route.base(),Route.url(),"\033[37m");
        }
        _createError(1000);
      }
      else if(!_firewall)
      {
        if(process.env.debug !== "false")
        {
          console.error('Blocked By Firewall: Request Module: \033[31m',Route.host(),Route.base(),Route.url(),"\033[37m");
        }
        _createError(500);
      }
      else
      {
        CreateFilter().type('file').pipe(_pipe).then(function(err){
          if(err !== undefined)
          {
            if(err === 404 && Route.url().indexOf(".") < 0)
            {
              CreateFilter().type('directory').pipe(_pipe).error(_createError).call(Route);
            }
            else
            {
              _createError(err);
            }
          }
        }).call(Route);
      }
    }

    Route.url = function(u)
    {
      if(u === undefined)
      {
        return _url;
      }
      _url = (typeof u === 'string' ? u : _url);
      return Route;
    }

    Route.ext = function(e)
    {
      if(e === undefined)
      {
        return _ext;
      }
      _ext = (typeof e === 'string' ? e : _ext);
      return Route;
    }

    Route.host = function(h)
    {
      if(h === undefined)
      {
        return _host;
      }
      _host = (typeof h === 'string' ? (h.indexOf(':') > -1 ? (h.substring(0,h.indexOf(':'))) : h) : _host);
      return Route;
    }

    Route.dir = function(h)
    {
      if(h === undefined)
      {
        return _dir;
      }
      _dir = (typeof n === 'string' ? n : _dir);
      return Route;
    }

    Route.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = (typeof b === 'string' ? (b.indexOf('/') !== 0 && b.length > 1 ? "/" : "")+b : _base);
      return Route;
    }

    Route.fileName = function(b)
    {
      if(b === undefined)
      {
        return _fileName;
      }
      _fileName = (typeof b === 'string' && b.indexOf('.') > -1 ? b : _fileName);
      return Route;
    }

    Route.location = function(u)
    {
      if(u === undefined)
      {
        return _location;
      }
      _location = (typeof u === 'string' ? u.replace(/\\/g,"/") : _location);
      return Route;
    }

    Route.ip = function(i)
    {
      if(i === undefined)
      {
        return _ip;
      }
      _ip = (typeof i === 'string' ? (i.substring(0,(i.indexOf(' ,') > -1 ? i.indexOf(' ,') : i.length)).replace('::1','').replace('::ffff:','')) : _ip);
      _ip = (_ip.length < 1 ? 'localhost' : _ip);
      return Route;
    }

    Route.protocol = function(b)
    {
      if(b === undefined)
      {
        return _protocol;
      }
      _protocol = (_protocolEnum.indexOf(b) > -1 ? b : _protocol);
      return Route;
    }

    Route.port = function(p)
    {
      if(p === undefined)
      {
        return _port;
      }
      _port = ((typeof p === 'number' || !isNaN(parseInt(p,10))) ? parseInt(p,10) : _port);
      return Route;
    }

    Route.config = function(c)
    {
      if(c === undefined)
      {
        return _config;
      }
      _config = (typeof c === 'object' ? c : config);
      return Route;
    }

    Route.query = function(q)
    {
      if(q === undefined)
      {
        return _query;
      }
      _query = (typeof q === 'object' ? q : _query);
      return Route;
    }

    Route.throwError = function(e)
    {
      if(e === undefined)
      {
        return _throwError;
      }
      _throwError = (typeof e === 'number' ? e : _throwError);
      return Route;
    }

    return Route;
  }
  return CreateRoute;
}(filter_module,send_module));
