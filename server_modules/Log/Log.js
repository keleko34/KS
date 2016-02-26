var request_log_module = require('./_RequestLog/RequestLog')
  , error_log_module = require('./_ErrorLog/ErrorLog')
  , fs_module = require('fs')

module.exports = (function(CreateRequestLog,CreateErrorLog,fs){
  function CreateLog()
  {
    var _host = ''
      , _type = 'err'
      , _typeEnum = ['error','request']
      , _ip = ''
      , _url = ''
      , _error = ''
      , _fileList = {}

    function Log()
    {
      var _logurl = (process.cwd().replace(/\\/g,"/")+"/logs")
        , _logFile = _logurl+(Log.type() !== 'error' ? "/"+Log.host() : "")+"/"+(Log.type()+'.log')
        , _message = ''
        , _writeToFile = function()
          {
            if(Log.fileList(_logFile) === undefined)
            {
              Log.fileList(_logFile,fs.createWriteStream(_logFile,{flags:'a+',autoClose:false}));
               Log.fileList(_logFile).on('error',function(){
                 Log.fileList(_logFile).end();
                 Log.fileList(_logFile,fs.createWriteStream(_logFile,{flags:'a+',autoClose:false}));
               });
            }
            Log.fileList(_logFile).write("\n"+_message);
          };
      switch(Log.type())
      {
        case 'error':
          _message = CreateErrorLog()
          .error(Log.error())
          .date(Log.getDate())
          .call(Log);
        break;
        case 'request':
          _message = CreateRequestLog()
          .ip(Log.ip())
          .url(Log.url())
          .date(Log.getDate())
          .call(Log);
        break;
      }
      _writeToFile();
    }

    Log.host = function(h)
    {
      if(h === undefined)
      {
        return _host;
      }
      _host = (typeof h === 'string' ? (h.indexOf(':') > -1 ? (h.substring(0,h.indexOf(':'))) : h) : _host);
      return Log;
    }

    Log.ip = function(i)
    {
      if(i === undefined)
      {
        return _ip;
      }
      _ip = (typeof i === 'string' ? (i.substring(0,(i.indexOf(' ,') > -1 ? i.indexOf(' ,') : i.length)).replace('::1','').replace('::ffff:','')) : _ip);
      _ip = (_ip.length < 1 ? 'localhost' : _ip);
      return Log;
    }

    Log.url = function(u)
    {
      if(u === undefined)
      {
        return _url;
      }
      _url = (typeof u === 'string' ? u : _url);
      return Log;
    }

    Log.type = function(t)
    {
      if(t === undefined)
      {
        return _type;
      }
      _type = (_typeEnum.indexOf(t) > -1 ? t : _type);
      return Log;
    }

    Log.error = function(err)
    {
      if(err === undefined)
      {
        return _error;
      }
      _error = (typeof err === 'string' ? err : _error);
      return Log;
    }
    
    Log.fileList = function(n,f)
    {
      if(n === undefined)
      {
        return _fileList;
      }
      if(f === undefined && typeof n === 'string')
      {
        return _fileList[n];
      }
      if(typeof n === 'string' && typeof f === 'object' && f.pipe !== undefined)
      {
        _fileList[n] = f;
      }
      return Log;
    }

    Log.getDate = function()
    {
      var date = new Date();

      var hour = date.getHours();
      hour = (hour < 10 ? "0" : "") + hour;

      var min  = date.getMinutes();
      min = (min < 10 ? "0" : "") + min;

      var sec  = date.getSeconds();
      sec = (sec < 10 ? "0" : "") + sec;

      var year = date.getFullYear();

      var month = date.getMonth() + 1;
      month = (month < 10 ? "0" : "") + month;

      var day  = date.getDate();
      day = (day < 10 ? "0" : "") + day;

      return "[" + year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec + "]";
    }

    return Log;
  }
  return CreateLog;
}(request_log_module,error_log_module,fs_module));
