var headers_module = require('./_Headers/Headers')
  , vhost_module = require('./../Vhost/Vhost')
  , error_module = require('./../Error/Error')
  , file_module = require('./../File/File')

module.exports = (function(CreateHeader,CreateVhost,CreateFile,CreateError){
  function CreateRequest()
  {
    var _requestOrder = ['alias','vhost','firewall','file','rest','directory','error']
      , _requestOrderEnum = ['alias','vhost','firewall','file','rest','directory','error']
      , _url =''
      , _query = {}
      , _onResponse = function(content,headers){}
      , _path = {root:'/',directory:'',base:'',ext:'',name:''}
      , _querystring = {}
      , _host = 'localhost'

    function Request(req)
    {
      /* set up the vhost localization, if admin is allowed whenever the url request /admin is inputed it will go to admin panel from any site
       * vhost returns the full directory to a given site determined by the host/domain name */
      var _vHost = CreateVhost().host(Request.host()).request(Request.parsedUrl().pathname)
        , _file  = CreateFile()
        , _siteConfig = config.sites[_vHost.host()];
      if(_siteConfig !== undefined)
      {
        _vHost.base((_siteConfig.app !== undefined ? (_siteConfig.app.base !== undefined ? _siteConfig.app.base : './app') : './app'))
        .admin((_siteConfig.app !== undefined ? (_siteConfig.app.admin !== undefined ? _siteConfig.app.admin : true) : true));

        console.log('incoming request: ', Request.parsedUrl().pathname,' on: ',_vHost.host(),' link: ',_vHost());
        _file.base(_vHost())
        .path(('.'+Request.parsedUrl().pathname).replace('./',''))
        .ext(Request.path().ext)
        .callback(function(content,err,contentType){
          if(content === undefined && err !== undefined)
          {
              Request.onResponse()
              .call(Request,CreateError().type(err)(),CreateHeader().status(err).contentType(_siteConfig.content_types[contentType].type).encoding(_siteConfig.content_types[contentType].encoding)(req));
          }
          else
          {
            console.log(_siteConfig.content_types[contentType],contentType);
            Request.onResponse()
              .call(Request,content,CreateHeader().contentType(_siteConfig.content_types[contentType].type).encoding(_siteConfig.content_types[contentType].encoding)(req),true);
            return;
          }
        })
        .call(Request);
      }
      else
      {
        Request.onResponse()
        .call(Request,"No site config was set up for this url, please create the configs through the admin panel",CreateHeader().status(404)(req));
      }
    }

    /* this is the request order in which checks should happen, so the request goes through each check in order */
    Request.requestOrder = function(n,t)
    {
      if(n === undefined)
      {
        return _requestOrder;
      }
      if(t === undefined && n.constructor === Array)
      {
        var valid = true;
        n.forEach(function(v,i){
          if(_typeEnum.indexOf(v) < 0)
          {
            valid = false;
          }
        });
        if(valid)
        {
          _requestOrder = n;
        }
        return Request;
      }
      if(typeof t === 'string' && _typeEnum.indexOf(t) > -1)
      {
        var i = ((typeof n === 'number' || !isNaN(parseInt(n))) && n <= 5 ? n : 0);
        _requestOrder[i] = t;
      }
      return Request;
    }

    Request.host = function(h)
    {
      if(h === undefined)
      {
        return _host;
      }
      _host = (typeof h === 'string' ? h : _host);
      return Request;
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

    Request.path = function(c)
    {
      if(c === undefined)
      {
        return _path;
      }
      _path = (typeof c === 'object' && c.ext !== undefined ? c : _path);
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
        return _queryString;
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
      _parsedUrl = (typeof u === 'object' && u.href !== undefined ? u : _parsedUrl);
      return Request;
    }

    Request.onResponse = function(o)
    {
      if(o === undefined)
      {
        return _onResponse;
      }
      _onResponse = (typeof o === 'function' ? o : _onResponse);
      return Request;
    }

    return Request;
  }
  return CreateRequest;
}(headers_module,vhost_module,file_module,error_module));
