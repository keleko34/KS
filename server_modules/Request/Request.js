var filter_module = require('./_Filter/Filter')
  , send_module = require('./_Send/Send');

module.exports = (function(CreateFilter,CreateSend){
  function CreateRequest()
  {
    var _pipeOrder = ['file','module','directory','error']
      , _url =''
      , _ext = ''
      , _base ='/app'
      , _fileName = ''
      , _dir = ''
      , _query = {}
      , _config = {}
      , _path = {root:'/',dir:'',base:'',ext:'',name:''}
      , _querystring = {}
      , _host = ''
      , _location = process.cwd().replace(/\\/g,"/")
      , _ip = ''
      , _protocol = 'http'
      , _protocolEnum = ['http','https']
      , _port = 8080
      , _throwError = 200

    function Request(res)
    {
      var _alias = CreateFilter().type('alias').call(Request)
        , _env = CreateFilter().type('env').call(Request)
        , _vhost = CreateFilter().type('vhost').call(Request)
        , _firewall = (_vhost ? (config.sites[Request.host()].app.firewall ? CreateFilter().type('firewall').call(Request) : true) : false)
        , _error = function(stream,code){
              var _send = CreateSend()
              .host(Request.host())
              .ext('html')
              .stream(true)
              .content(stream)
              .error(code)
              .call(Request,res);
          }
        , _pipe = function(stream,ext){
                var _send = CreateSend()
                .host(Request.host())
                .location(Request.protocol()+"://"+Request.host()+((Request.port() !== 80 && Request.port() !== 443) ? (":"+Request.port()) : "")+Request.base()+Request.url())
                .ext(ext)
                .stream(true)
                .error(200)
                .content(stream)
                .call(Request,res);
          }
        , _createError = function(err)
          {
            CreateFilter().type('error').statusCode(err).error(_error).call(Request);
          }

      if(Request.throwError() !== 200)
      {
        if(process.env.debug !== "false")
        {
          console.error('Throwing Request Error: Request Module: \033[31m',Request.host(),Request.base(),Request.url(),"\033[37m");
        }
        _createError(Request.throwError());
      }
      else if(!_vhost)
      {
        if(process.env.debug !== "false")
        {
          console.error('VHOST not found: Request Module: \033[31m',Request.host(),Request.base(),Request.url(),"\033[37m");
        }
        _createError(1000);
      }
      else if(!_firewall)
      {
        if(process.env.debug !== "false")
        {
          console.error('Blocked By Firewall: Request Module: \033[31m',Request.host(),Request.base(),Request.url(),"\033[37m");
        }
        _createError(500);
      }
      else
      {
        CreateFilter().type('file').pipe(_pipe).then(function(err){
          if(err !== undefined)
          {
            if(err === 404 && Request.url().indexOf(".") < 0)
            {
              CreateFilter().type('directory').pipe(_pipe).error(_createError).call(Request);
            }
            else
            {
              _createError(err);
            }
          }
        }).call(Request);
      }
    }

    Request.url = function(u)
    {
      if(u === undefined)
      {
        return _url;
      }
      _url = (typeof u === 'string' ? u : _url);
      return Request;
    }

    Request.ext = function(e)
    {
      if(e === undefined)
      {
        return _ext;
      }
      _ext = (typeof e === 'string' ? e : _ext);
      return Request;
    }

    Request.host = function(h)
    {
      if(h === undefined)
      {
        return _host;
      }
      _host = (typeof h === 'string' ? (h.indexOf(':') > -1 ? (h.substring(0,h.indexOf(':'))) : h) : _host);
      return Request;
    }

    Request.dir = function(h)
    {
      if(h === undefined)
      {
        return _dir;
      }
      _dir = (typeof n === 'string' ? n : _dir);
      return Request;
    }

    Request.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = (typeof b === 'string' ? (b.indexOf('/') !== 0 && b.length > 1 ? "/" : "")+b : _base);
      return Request;
    }

    Request.fileName = function(b)
    {
      if(b === undefined)
      {
        return _fileName;
      }
      _fileName = (typeof b === 'string' && b.indexOf('.') > -1 ? b : _fileName);
      return Request;
    }

    Request.location = function(u)
    {
      if(u === undefined)
      {
        return _location;
      }
      _location = (typeof u === 'string' ? u.replace(/\\/g,"/") : _location);
      return Request;
    }

    Request.ip = function(i)
    {
      if(i === undefined)
      {
        return _ip;
      }
      _ip = (typeof i === 'string' ? (i.substring(0,(i.indexOf(' ,') > -1 ? i.indexOf(' ,') : i.length)).replace('::1','').replace('::ffff:','')) : _ip);
      _ip = (_ip.length < 1 ? 'localhost' : _ip);
      return Request;
    }

    Request.protocol = function(b)
    {
      if(b === undefined)
      {
        return _protocol;
      }
      _protocol = (_protocolEnum.indexOf(b) > -1 ? b : _protocol);
      return Request;
    }

    Request.port = function(p)
    {
      if(p === undefined)
      {
        return _port;
      }
      _port = ((typeof p === 'number' || !isNaN(parseInt(p,10))) ? parseInt(p,10) : _port);
      return Request;
    }

    Request.path = function(c)
    {
      if(c === undefined)
      {
        return _path;
      }
      _path = (typeof c === 'object' && c.ext !== undefined ? c : _path);
      return Request;
    }

    Request.config = function(c)
    {
      if(c === undefined)
      {
        return _config;
      }
      _config = (typeof c === 'object' ? c : config);
      return Request;
    }

    Request.query = function(q)
    {
      if(q === undefined)
      {
        return _query;
      }
      _query = (typeof q === 'object' ? q : _query);
      return Request;
    }

    Request.queryString = function(q)
    {
      if(q === undefined)
      {
        return _querystring;
      }
      _querystring = (typeof q === 'object' ? q : _querystring);
      return Request;
    }

    Request.parsedUrl = function(u)
    {
      if(u === undefined)
      {
        return _parsedUrl;
      }
      _parsedUrl = (typeof u === 'object' && u.pathname !== undefined ? u : _parsedUrl);
      return Request;
    }

    Request.throwError = function(e)
    {
      if(e === undefined)
      {
        return _throwError;
      }
      _throwError = (typeof e === 'number' ? e : _throwError);
      return Request;
    }

    return Request;
  }
  return CreateRequest;
}(filter_module,send_module));
