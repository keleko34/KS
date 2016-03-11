  var path_module = require('path')
  , url_module = require('url')
  , query_module = require('querystring')

module.exports = (function(path,url,query){
  function CreateRequest()
  {
    var _status = 200
      , _headers = {}
      , _referer = ''
      , _referPath = ''
      , _host = ''
      , _config = {}
      , _appConfig = {}
      , _envConfig = {}
      , _port = 8080
      , _url = ''
      , _ext = ''
      , _dir = ''
      , _filename = ''
      , _query = {}
      , _referQuery = {}
      , _urlQuery = {}
      , _ip = ''
      , _base = '/app'

    function Request()
    {
      if(_host.length > 0 && config.sites[_host] !== undefined)
      {
        Request.config(config.sites[_host]);
      }
      else
      {
        Request.status(1000);
      }

      if(_referPath.length > 0 && _referPath.indexOf("/admin") < 0 && Request.url().indexOf("/admin") > -1)
      {
        Request.status(500);
      }
      else
      {
        Request.status(200);
      }
      Object.keys(_referQuery).forEach(function(k,i){
        if(_urlQuery[k] === undefined)
        {
          _urlQuery[k] = _referQuery[k];
        }
      });
      Object.keys(_urlQuery).forEach(function(k,i){
        if(_query[k] === undefined)
        {
          _query[k] = _urlQuery[k];
        }
      });

      Request.dir(Request.url());
      Request.filename(Request.url());
      Request.base((Request.referPath().indexOf('/admin') === 0 || Request.url().indexOf('/admin') === 0) ? '/admin' : Request.base());
      Object.keys(Request.envConfig()).forEach(function(e,i){
        if(Request.base().indexOf("/admin") !== 0)
        {
          e = e.replace("*","");
          console.log(Request.referPath().replace("/",""),e,Request.referPath().replace("/","").indexOf(e));
          if(Request.referPath().replace("/","").indexOf(e) === 0)
          {
            Request.base("/"+e);
          }
        }
      });
    }

    Request.status = function(s)
    {
      if(s === undefined)
      {
        return _status;
      }
      _status = (typeof s === 'number' ? s : _status);
      return Request;
    }

    Request.headers = function(s)
    {
      if(s === undefined)
      {
        return _headers;
      }
      _headers = (typeof s === 'objetc' && s.host !== undefined ? s : _headers);
      return Request;
    }

    Request.referer = function(s)
    {
      if(s === undefined)
      {
        return _referer;
      }
      _referer = (typeof s === 'string' && s.length > 0 ? s : _referer);
      return Request;
    }

    Request.referPath = function(s)
    {
      if(s === undefined)
      {
        return _referPath;
      }
      if(typeof s === 'string' && s === Request.referer() && s.length > 0)
      {
        _referPath = (decodeURI(url.parse(s).pathname) !== "/" ? decodeURI(url.parse(s).pathname) : _referPath);
      }
      return Request;
    }

    Request.host = function(s)
    {
      if(s === undefined)
      {
        return _host;
      }
      if(Request.referer().length > 0)
      {
        _host = url.parse(_referer).hostname;
      }
      else if(typeof s === 'object' && s.host !== undefined)
      {
        _host = (s.host.substring(0,(s.host.indexOf(":") > -1 ? s.host.indexOf(":") : s.host.length)));
      }
      Request.config(config.sites[_host]);
      return Request;
    }

    Request.config = function(c)
    {
      if(c === undefined)
      {
        return _config;
      }
      _config = (typeof c === 'object' && c.app !== undefined ? c : _config);
      Request.appConfig(_config.app);
      return Request;
    }

    Request.appConfig = function(c)
    {
      if(c === undefined)
      {
        return _appConfig;
      }
      _appConfig = (typeof c === 'object' && c.env !== undefined ? c : _appConfig);
      Request.envConfig(_appConfig.env);
      Request.base(_appConfig.base);
      return Request;
    }

    Request.envConfig = function(c)
    {
      if(c === undefined)
      {
        return _envConfig;
      }
      _envConfig = (typeof c === 'object' ? c : _envConfig);
      return Request;
    }

    Request.port = function(p)
    {
      if(p === undefined)
      {
        return _port;
      }
      _port = (typeof p === 'number' || !isNaN(parseInt(p,10)) ? parseInt(p,10) : _port);
      return Request;
    }

    Request.url = function(u)
    {
      if(u === undefined)
      {
        return _url;
      }
      _url = (typeof u === 'string' ? (decodeURI(url.parse(u).pathname)) : _url);
      if(Request.referPath().indexOf(path.parse(_url).dir) > -1)
      {
        var _hasSeporator = (path.parse(_url).base.indexOf(".") < 0 ? (path.parse(_url).base.indexOf("/") !== 0 ? "/" : "") : "")
          , _isSubdir = (path.parse(_url).base.indexOf(".") < 0 ? (_url.lastIndexOf("/") === (_url.length-1) ? "/" : "") : "");
      }
      else
      {
        var _urlHasEnv = (_envConfig[_url.substring(0,_url.indexOf("/",1)).replace("/","")] !== undefined ? true : false);
        _url = (!_urlHasEnv ? (Request.referPath()+_url) : _url);
      }
      return Request;
    }

    Request.ext = function(e)
    {
      if(e === undefined)
      {
        return _ext;
      }
      _ext = (typeof e === 'string' && e.indexOf('.') > -1 ? (path.parse(e).ext.replace('.','')) : _ext);
      return Request;
    }

    Request.dir = function(d)
    {
      if(d === undefined)
      {
        return _dir;
      }
      _dir = (typeof d === 'string' ? path.parse(d).dir : _dir);
      return Request;
    }

    Request.filename = function(f)
    {
      if(f === undefined)
      {
        return _filename;
      }
      _filename = (typeof f === 'string' ? (path.parse(f).dir) : _filename);
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

    Request.referQuery = function(q)
    {
      if(q === undefined)
      {
        return _referQuery;
      }
      _referQuery = (typeof q === 'string' ? query.parse(decodeURI(url.parse(q).query)) : _referQuery);
      _referQuery = (_referQuery.null !== undefined ? {} : _referQuery);
      return Request;
    }

    Request.urlQuery = function(q)
    {
      if(q === undefined)
      {
        return _urlQuery;
      }
      _urlQuery = (typeof q === 'string' ? query.parse(decodeURI(url.parse(q).query)) : _urlQuery);
      _urlQuery = (_urlQuery.null !== undefined ? {} : _urlQuery);
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

    Request.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = (typeof b === 'string' && b.indexOf('/') === 0 ? b : _base);
      return Request;
    }

    return Request;
  }
  return CreateRequest;
}(path_module,url_module,query_module));
