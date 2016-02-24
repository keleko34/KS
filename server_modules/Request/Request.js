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
      , _host = 'localhost'
      , _location = process.cwd().replace(/\\/g,"/")

    function Request(res)
    {
      var _alias = CreateFilter().type('alias').call(Request)
        , _env = CreateFilter().type('env').call(Request)
        , _vhost = CreateFilter().type('vhost').call(Request)
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
                .ext(ext)
                .stream(true)
                .content(stream)
                .call(Request,res);
          }
        , _createError = function(err)
          {
            CreateFilter().type('error').statusCode(err).error(_error).call(Request);
          }

      if(!_vhost)
      {
        _createError(1000);
      }
      else
      {
        CreateFilter().type('file').pipe(_pipe).error(_createError).call(Request);
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
      _host = (typeof n === 'string' ? (n.indexOf(':') > -1 ? (n.substring(0,n.indexOf(':'))) : n) : _host);
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

    return Request;
  }
  return CreateRequest;
}(filter_module,send_module));
