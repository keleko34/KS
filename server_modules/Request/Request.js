var headers_module = require('./_Headers/Headers')
  , vhost_module = require('./../Vhost/Vhost')
  , error_module = require('./../Error/Error')
  , file_module = require('./../File/File')

module.exports = (function(CreateHeader,CreateVhost,CreateFile){
  function CreateRequest()
  {
    var _requestOrder = ['alias','vhost','firewall','file','rest','directory','error']
      , _requestOrderEnum = ['alias','vhost','firewall','file','rest','directory','error']
      , _config = {}
      , _url =''
      , _query = {}
      , _onResponse = function(content,headers){}
      , _path = {root:'/',directory:'',base:'',ext:'',name:''}
      , _querystring = {}
      , _headers = {host:'localhost'}

    function Request(req)
    {

      /* set up the vhost localization, if admin is allowed whenever the url request /admin is inputed it will go to admin panel from any site
       * vhost returns the full directory to a given site determined by the host/domain name */
      var vHost = CreateVhost().host(Request.headers().host)
        , siteConfig = Request.config().sites[vHost.host()];
      if(siteConfig !== undefined)
      {
        vHost.base((siteConfig.app !== undefined ? (siteConfig.app.base !== undefined ? siteConfig.app.base : './app') : './app'))
        .admin((siteConfig.app !== undefined ? (siteConfig.app.admin !== undefined ? siteConfig.app.admin : true) : true));

        CreateFile().base(vHost(''))
        .path(Request.url())
        .ext(Request.path().ext)
        .callback(function(content,err){
          if(content === undefined && err !== undefined)
          {
            if(typeof err === 'number')
            {
              Request.onResponse()
              .call(Request,CreateError().type(err)(),CreateHeader().status(err)(req));
            }
            else
            {
              Request.onResponse()
              .call(Request,"No index here",CreateHeader().status(404)(req));
            }
          }
          else
          {
            Request.onResponse()
              .call(Request,content,CreateHeader()(req),true);
          }
        });

      }
      else
      {
        Request.onResponse()
        .call(Request,"No site config was set up for this url, please create the configs through the admin panel",CreateHeader().status(404)(req));
        return;
      }

      Request.onResponse()
      .call(Request,"",CreateHeader().status(404)(req));
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

    /* config is updated with every request to the curent config, as changes may have happened from admin */
    Request.config = function(c)
    {
      if(c === undefined)
      {
        return _config;
      }
      _config = (typeof c === 'object' ? c : _config);
      return Request;
    }

    Request.headers = function(h)
    {
      if(h === undefined)
      {
        return _headers;
      }
      _headers = (typeof h === 'object' && h.host !== undefined ? h : _headers);
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
}(headers_module,vhost_module,file_module));
