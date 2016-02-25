var server_modules_path = './../../../server_modules';

var http_module = require(server_modules_path+'/HTTP/HTTP')
  , http_server_module = require('http')
  , https_module = require(server_modules_path+'/HTTPS/HTTPS')
  , https_server_module = require('https')
  , request_module = require(server_modules_path+'/Request/Request')
  , path_module = require('path')
  , url_module = require('url')
  , query_module = require('querystring')

module.exports = (function(CreateHTTP,CreateHTTPS,CreateRequest,http,https,path,url,querystring){
  function CreateForkCommands()
  {
    var _fork = function(){};

    function ForkCommands()
    {
      return {
        fork_start:ForkCommands.fork_start,
        server_start:ForkCommands.server_start,
        server_stop:ForkCommands.server_stop,
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
        process.on('error',function(err){
          console.error('ERR,',err,' From Fork '+ForkCommands.fork().id());
          console.error("ERR Stack",err.stack);
        })
        process.once('disconnect',function(){
          process.kill(process.pid);
        });
        process.commands = ForkCommands.fork().comm().commands();
        ForkCommands.fork().status('online');
      }
   }

  ForkCommands.server_start = function(data)
  {
    if(config !== undefined && ForkCommands.fork().status() === 'online')
    {

        var serverRequest = function(req,res){
          console.log(req.url)
          var _error = 200
            , _headers = (req.headers !== undefined ? req.headers : {})
            , _referer = (_headers.referer !== undefined ? _headers.referer : (_headers.referrer !== undefined ? _headers.referrer : ""))
            , _refererPath = (_referer.length > 0 ? (decodeURI(url.parse(_referer).path) !== "/" ? decodeURI(url.parse(_referer).path) : "")  : "")
            , _host = (_referer.length > 0 ? url.parse(_referer).hostname :
                      (_headers.host !== undefined ?
                      (_headers.host.substring(0,
                      (_headers.host.indexOf(":") > -1 ? _headers.host.indexOf(":") : _headers.host.length))
                      ) : ("")))
            , _error = (config.sites[_host] === undefined ? 1000 : 200)
            , _config = (_error !== 200 ? config.sites[_host] : {})
            , _appConfig = (_config.app !== undefined ? _config.app : {})
            , _envConfig = (_appConfig.env !== undefined ? _appConfig.env : {})
            , _port = (config.server.http !== undefined ? config.server.http.port : 8080)
            , _url = decodeURI(url.parse(req.url !== undefined ? req.url : '/').pathname)
            , _error = (_refererPath.length > 0 && _refererPath.indexOf("/admin") < 0 && _url.indexOf("/admin") > -1 ? 500 : 200)
            , _urlHasEnv = (_envConfig[_url.substring(0,_url.indexOf("/",1)).replace("/","")] !== undefined ? true : false)
            , _url = (_refererPath.length > 0 ? (_urlHasEnv ? _url : (_refererPath+_url)) : _url)
            , _ext = path.parse(_url).ext.replace('.','')
            , _dir = path.parse(_url).dir
            , _filename = (path.parse(_url).base)
            , _query = (req.query !== undefined ? req.query : {})
            , _queryString = querystring.parse((_referer.length > 0 ? decodeURI(url.parse(_referer).query) : "")+decodeURI(url.parse(req.url !== undefined ? req.url : '/').query))
            , _ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress);

            console.log(_url,_host,_error);

            var _request = CreateRequest()
            .url(_url)
            .ext(_ext)
            .host(_host)
            .dir(_dir)
            .fileName(_filename)
            .query(_query)
            .queryString(_queryString)
            .parsedUrl(url.parse(req.url !== undefined ? req.url : '/'))
            .path(path.parse(_url))
            .ip(_ip)
            .port(_port)
            .config(_config)
            .base(_appConfig.base !== undefined ? _appConfig.base : '/app')
            .protocol('http')
            .throwError(_error)
            .call(ForkCommands.fork().http(),res)

        }

        ForkCommands.fork()
        .http(CreateHTTP()
          .server(http.createServer(serverRequest))
          .port((config.server.http !== undefined ? config.server.http.port : 8080))
          .status('online'))
          .http()
        .call(ForkCommands.fork().http());
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
}(http_module,https_module,request_module,http_server_module,https_server_module,path_module,url_module,query_module));
