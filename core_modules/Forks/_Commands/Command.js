var server_modules_path = './../../../server_modules';

var http_module = require(server_modules_path+'/HTTP/HTTP')
  , http_server_module = require('http')
  , https_module = require(server_modules_path+'/HTTPS/HTTPS')
  , https_server_module = require('https')
  , request_module = require(server_modules_path+'/Request/Request')
  , route_module = require(server_modules_path+'/Route/Route')
  , log_module = require(server_modules_path+'/Log/Log')
  , path_module = require('path')
  , url_module = require('url')
  , query_module = require('querystring')

module.exports = (function(CreateHTTP,CreateHTTPS,CreateRequest,CreateRoute,CreateLog,http,https,path,url,querystring){
  function CreateForkCommands()
  {
    var _fork = function(){}
      , _logger = CreateLog()

    function ForkCommands()
    {
      return {
        fork_start:ForkCommands.fork_start,
        server_start:ForkCommands.server_start,
        server_stop:ForkCommands.server_stop,
        log_error:ForkCommands.log_error,
        echo:ForkCommands.echo
      }
    }

    ForkCommands.fork = function(f)
    {
      if(f === undefined)
      {
        return _fork;
      }
      _fork = (typeof f === 'function' ? f : _fork);
      return ForkCommands;
    }

    /* Method Commands */
    ForkCommands.fork_start = function(data)
    {
     /* attach process events */
      if(ForkCommands.fork().status() !== 'online')
      {
        process.send({command:'echo',data:{message:'Started: Fork:   '+data.id+' PID: '+process.pid}});
        process.once('uncaughtException',ForkCommands.fork().exception());
        process.on('message',ForkCommands.fork().comm());
        process.once('error',ForkCommands.fork().exception())
        process.once('disconnect',function(){
          process.kill(process.pid);
        });
        ForkCommands.fork().status('online');
      }
   }

    ForkCommands.server_start = function(data)
    {
    if(config !== undefined && ForkCommands.fork().status() === 'online')
    {
        var _serverRequest = function(req,res){

          /*
          var _error = 200
            , _headers = (req.headers !== undefined ? req.headers : {})
            , _referer = (_headers.referer !== undefined ? _headers.referer : (_headers.referrer !== undefined ? _headers.referrer : ""))
            , _refererPath = (_referer.length > 0 ? (decodeURI(url.parse(_referer).pathname) !== "/" ? decodeURI(url.parse(_referer).pathname) : "")  : "")
            , _host = (_referer.length > 0 ? url.parse(_referer).hostname :
                      (_headers.host !== undefined ?
                      (_headers.host.substring(0,
                      (_headers.host.indexOf(":") > -1 ? _headers.host.indexOf(":") : _headers.host.length))
                      ) : ("")))
            , _error = (config.sites[_host] === undefined ? 1000 : 200)
            , _config = (_error === 200 ? config.sites[_host] : {})
            , _appConfig = (_config.app !== undefined ? _config.app : {})
            , _envConfig = (_appConfig.env !== undefined ? _appConfig.env : {})
            , _port = (config.server.http !== undefined ? config.server.http.port : 8080)

            , _url = decodeURI(url.parse(req.url !== undefined ? req.url : '/').pathname)
            , _error = (_refererPath.length > 0 && _refererPath.indexOf("/admin") < 0 && _url.indexOf("/admin") > -1 ? 500 : 200)
            , _urlHasEnv = (_envConfig[_url.substring(0,_url.indexOf("/",1)).replace("/","")] !== undefined ? true : false)
            if(process.env.debug !== "false")
            {
              console.log("Pre Url: ",_url,req.url,path.parse(_url));
            }
            if(_refererPath.indexOf(path.parse(_url).dir) > -1)
            {
              
              var _hasSeporator = (path.parse(_url).base.indexOf(".") < 0 ? (path.parse(_url).base.indexOf("/") !== 0 ? "/" : "") : "")
                , _isSubdir = (path.parse(_url).base.indexOf(".") < 0 ? (_url.lastIndexOf("/") === (_url.length-1) ? "/" : "") : "");
              console.log(_refererPath,_hasSeporator,path.parse(_url).base,_isSubdir);
              _url = (_refererPath+_hasSeporator+path.parse(_url).base+_isSubdir);
            }
            else
            {
              _url = (!_urlHasEnv ? (_refererPath+_url) : _url);
            }
            var _ext = path.parse(_url).ext.replace('.','')
            , _dir = path.parse(_url).dir
            , _filename = (path.parse(_url).base)
            , _query = (req.query !== undefined ? req.query : {})
            , _referQuery = querystring.parse((_referer.length > 0 ? decodeURI(url.parse(_referer).query) : ""))
            , _queryString = querystring.parse(decodeURI(url.parse(req.url !== undefined ? req.url : '/').query))
            , _ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress);
          
            Object.keys(_referQuery).forEach(function(k,i){
              if(_queryString[k] === undefined)
              {
                _queryString[k] = _referQuery[k];
              }
            });
          
            if(process.env.debug !== "false")
            {
              console.log("Reffered: ",_referer," Referer Path: ",_refererPath," Url: ",_url," Query: ",_queryString," Host: ",_host," ip: ",_ip," Error: ",_error);
            }
            */
            var _referer = (req.headers.referer || req.headers.referrer);
            var _request = CreateRequest()
            .headers(req.headers)
            .referer(_referer !== undefined ? _referer : '')
            .referPath(_referer !== undefined ? _referer : '')
            .host(req.headers)
            .port((config.server.http !== undefined ? (config.server.http.port) : 8080))
            .query(req.query !== undefined ? req.query : {})
            .url(req.url)
            .ip((req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress))
            .ext(req.url)
            .referQuery(_referer !== undefined ? _referer : '')
            .urlQuery(req.url);
            _request.call({},req);

            if(process.env.debug !== "false")
            {
               console.log("Request Info: URL: ",_request.url()," HOST: ",_request.host()," IP: ",_request.ip(), " Query: ",_request.query(), " ReferrerPath: ", _request.referPath()," Base: ",_request.base());
            }

            var _route = CreateRoute()
            .url(_request.url())
            .ext(_request.ext())
            .host(_request.host())
            .dir(_request.dir())
            .fileName(_request.filename())
            .query(_request.query())
            .ip(_request.ip())
            .port(_request.port())
            .config(_request.config())
            .base(_request.base())
            .protocol('http')
            .throwError(_request.status());

            _route.call(ForkCommands.fork().http(),res);

            if(_request.appConfig().logging !== undefined && _request.appConfig().logging && _error === 200 && _referer.length < 1)
            {
              _logger.host(_route.host())
              .url(_route.base()+_route.url())
              .ip(_route.ip())
              .type('request')
              .error(_request.status())
              .call(_route);
            }
        }
          , _server = http.createServer(_serverRequest)

        _server.on('data',function(){}) //forces to stream flow mode

        _server.setTimeout((1000*60*1),function(s){
          s.end();
        })

        ForkCommands.fork()
        .http(CreateHTTP()
          .server(_server)
          .port((config.server.http !== undefined ? config.server.http.port : 8080))
          .status('online'))
          .http()
        .call(ForkCommands.fork().http());
    }
  }

    ForkCommands.log_error = function(data)
    {
      if(config !== undefined && config.server !== undefined && data.err !== undefined && data.stack !== undefined)
      {
        if(config.server.logging)
        {
          _logger
          .type('error')
          .error(data.err + " \n " + (data.stack.substring(0,(data.stack.indexOf("at",(data.stack.indexOf("at")+1))))) + " \n ")
          .call(data);
        }
      }
    }

    ForkCommands.server_stop = function()
    {
      ForkCommands.fork()
      .http()
      .status('offline')
      .call(ForkCommands.fork().http());
    }

    ForkCommands.echo = function(data)
    {
      if(data.message !== undefined)
      {
        console.log('From thread '+ForkCommands.fork().id()+': '+data.message);
      }
    }
    return ForkCommands;
  }
  return CreateForkCommands;
}(http_module,https_module,request_module,route_module,log_module,http_server_module,https_server_module,path_module,url_module,query_module));
