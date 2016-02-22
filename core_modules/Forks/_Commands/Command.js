var server_modules_path = './../../../server_modules';

var http_module = require(server_modules_path+'/HTTP/HTTP')
  , http_server_module = require('http')
  , https_module = require(server_modules_path+'/HTTPS/HTTPS')
  , https_server_module = require('https')
  , request_module = require(server_modules_path+'/Request/Request')
  , response_module = require(server_modules_path+'/Response/Response')
  , path_module = require('path')
  , url_module = require('url')
  , query_module = require('querystring')

module.exports = (function(CreateHTTP,CreateHTTPS,CreateRequest,CreateResponse,http,https,path,url,querystring){
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
        process.on('error',function(msg){console.log('ERR,',msg,' From Fork '+ForkCommands.fork().id());})
        process.once('disconnect',function(){
          process.kill(process.pid);
        });
        process.commands = ForkCommands.fork().comm().commands();
        ForkCommands.fork().status('online');
      }
   }

  ForkCommands.server_start = function(data)
  {
    if(data.config !== undefined && ForkCommands.fork().status() === 'online')
    {
        ForkCommands.fork().http(CreateHTTP()
            .server(http.createServer(function(req,res){

                CreateRequest()
                .config(ForkCommands.fork().config())
                .url(decodeURI(req.url !== undefined ? req.url : '/'))
                .parsedUrl(url.parse(decodeURI(req.url !== undefined ? req.url : '/')))
                .path(path.parse(decodeURI(req.url !== undefined ? req.url : '/')))
                .query((req.query !== undefined) ? req.query : {})
                .queryString(querystring.parse(decodeURI(req.url !== undefined ? req.url : '/')))
                .headers((req.headers !== undefined ? req.headers : {host:'localhost'}))
                .onResponse(function(content,headers,isStream){

                    CreateResponse()
                    .content(content)
                    .headers(headers)
                    .type((isStream ? 'stream' : 'content'))
                    .call(ForkCommands.fork().http(),res);

                })
                .call(ForkCommands.fork().http(),req);
          }))
          .port((data.config.server.http !== undefined ? data.config.server.http.port : 8080))
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
}(http_module,https_module,request_module,response_module,http_server_module,https_server_module,path_module,url_module,query_module));
