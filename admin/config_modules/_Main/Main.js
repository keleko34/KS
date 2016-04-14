//done
var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(jsonfile,fs){
  function CreateMain()
  {
    var _path = ''
      , _config = {}
      , _httpPort = 8080
      , _httpsPort = 443
      , _http2Port = 443
      , _httpsKey = ''
      , _httpsCert = ''
      , _httpsCa = ''
      , _httpsRequestCert = true
      , _httpsRejectUnauthorized = true
      , _https2Key = ''
      , _http2Cert = ''
      , _http2Ca = ''
      , _http2RequestCert = true
      , _http2RejectUnauthorized = true

    function Main()
    {
      _config = jsonfile.readFileSync(_path);
    }

    Main.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Main;
    }

    Main.update = function()
    {
      jsonfile.writeFileSync(_path,_config,{spaces: 1});
    }

    Main.checkFile = function(p)
    {
      try
      {
        _key = fs.readFileSync(p);
      }
      catch(e)
      {
        if(e.code === "ENOENT" && process.send !== undefined)
        {
          process.send({"command":"debug","data":{"msg":"\033[91m"+e.code+" Missing File Key: \033[39m"+p}});
        }
        return false;
      }
      return true;
    }

    Main.config = function()
    {
      return _config;
    }

    Main.httpPort = function(v)
    {
      if(v === undefined)
      {
        return _httpPort;
      }
      if(typeof v === 'number' && _httpPort !== v)
      {
        _httpPort = v;
        _config.http.port = v;
        Main.update();
      }
      return Main;
    }

    Main.httpsPort = function(v)
    {
      if(v === undefined)
      {
        return _httpsPort;
      }
      if(typeof v === 'number' && _httpsPort !== v)
      {
        _httpsPort = v;
        _config.https.port = v;
        Main.update();
      }
      return Main;
    }

    Main.http2Port = function(v)
    {
      if(v === undefined)
      {
        return _http2Port;
      }
      if(typeof v === 'number' && _http2Port !== v)
      {
        _http2Port = v;
        _config.http2.port = v;
        Main.update();
      }
      return Main;
    }

    Main.httpsKey = function(v)
    {
      if(v === undefined)
      {
        return _httpsKey;
      }
      if(typeof v === 'string' && _httpsKey !== v)
      {
        if(Main.checkFile(v))
        {
          _httpsKey = v;
          _config.https.key = v;
          Main.update();
        }
      }
      return Main;
    }

    Main.http2Key = function(v)
    {
      if(v === undefined)
      {
        return _http2Key;
      }
      if(typeof v === 'string' && _http2Key !== v)
      {
        if(Main.checkFile(v))
        {
          _http2Key = v;
          _config.http2.key = v;
          Main.update();
        }
      }
      return Main;
    }

    Main.httpsCert = function(v)
    {
      if(v === undefined)
      {
        return _httpsCert;
      }
      if(typeof v === 'string' && _httpsCert !== v)
      {
        if(Main.checkFile(v))
        {
          _httpsCert = v;
          _config.https.cert = v;
          Main.update();
        }
      }
      return Main;
    }

    Main.http2Cert = function(v)
    {
      if(v === undefined)
      {
        return _http2Cert;
      }
      if(typeof v === 'string' && _http2Cert !== v)
      {
        if(Main.checkFile(v))
        {
          _http2Cert = v;
          _config.http2.cert = v;
          Main.update();
        }
      }
      return Main;
    }

    Main.httpsCa = function(v)
    {
      if(v === undefined)
      {
        return _httpsCa;
      }
      if(typeof v === 'string' && _httpsCa !== v)
      {
        if(Main.checkFile(v))
        {
          _httpsCa = v;
          _config.https.ca = v;
          Main.update();
        }
      }
      return Main;
    }

    Main.http2Ca = function(v)
    {
      if(v === undefined)
      {
        return _http2Ca;
      }
      if(typeof v === 'string' && _http2Ca !== v)
      {
        if(Main.checkFile(v))
        {
          _http2Ca = v;
          _config.http2.ca = v;
          Main.update();
        }
      }
      return Main;
    }

    Main.httpsRequestCert = function(v)
    {
      if(v === undefined)
      {
        return _httpsRequestCert;
      }
      if(_httpsRequestCert !== v)
      {
        _httpsRequestCert = !!v;
        _config.https.requestCert = !!v;
        Main.update();
      }
      return Main;
    }

    Main.http2RequestCert = function(v)
    {
      if(v === undefined)
      {
        return _http2RequestCert;
      }
      if(_http2RequestCert !== v)
      {
        _http2RequestCert = !!v;
        _config.http2.requestCert = !!v;
        Main.update();
      }
      return Main;
    }

    Main.httpsRejectUnauthorized = function(v)
    {
      if(v === undefined)
      {
        return _httpsRejectUnauthorized;
      }
      if(_httpsRejectUnauthorized !== v)
      {
        _httpsRejectUnauthorized = !!v;
        _config.https.rejectUnauthorized = !!v;
        Main.update();
      }
      return Main;
    }

    Main.http2RejectUnauthorized = function(v)
    {
      if(v === undefined)
      {
        return _http2RejectUnauthorized;
      }
      if(_http2RejectUnauthorized !== v)
      {
        _http2RejectUnauthorized = !!v;
        _config.http2.rejectUnauthorized = !!v;
        Main.update();
      }
      return Main;
    }

    return Main;
  }
  return CreateMain;
}(jsonfile_module,fs_module));
