var fs_module = require('fs');

module.exports = (function(fs){
  function CreateType()
  {
    var _protocol = 'HTTP'
      , _protocolEnum = ['HTTP','HTTPS','HTTP2']
      , _port = 8080
      , _keyPath = ''
      , _key = ''
      , _certPath = ''
      , _cert = ''
      , _caPath = ''
      , _ca = ''
      , _requestCert = true
      , _rejectUnauthorized = true

    function Type()
    {
      try
      {
        _key = fs.readFileSync(_keyPath);
      }
      catch(e)
      {
        if(e.code === "ENOENT" && process.send !== undefined)
        {
          process.send({"command":"debug","data":{"msg":"\033[91m"+e.code+" Missing File Key: \033[39m"+_keyPath}});
        }
      }

      try
      {
        _cert = fs.readFileSync(_certPath);
      }
      catch(e)
      {
        if(e.code === "ENOENT" && process.send !== undefined)
        {
          process.send({"command":"debug","data":{"msg":"\033[91m"+e.code+" Missing File Cert: \033[39m"+_certPath}});
        }
      }

      try
      {
        _ca = fs.readFileSync(_caPath);
      }
      catch(e)
      {
        if(e.code === "ENOENT" && process.send !== undefined)
        {
          process.send({"command":"debug","data":{"msg":"\033[91m"+e.code+" Missing File Key: \033[39m"+_caPath}});
        }
      }
    }

    Type.protocol = function(v)
    {
      if(v === undefined)
      {
        return _protocol;
      }
      _protocol = (_protocolEnum.indexOf(v) > -1 ? v : _protocol);
      return Type;
    }

    Type.port = function(v)
    {
      if(v === undefined)
      {
        return _port;
      }
      _port = (typeof v === 'number' || !isNaN(parseInt(v,10)) ? parseInt(v,10) : _port);
      return Type;
    }

    Type.keyPath = function(v)
    {
      if(v === undefined)
      {
        return _keyPath;
      }
      _keyPath = (typeof v === 'string' ? v : _keyPath);
      return Type;
    }

    Type.certPath = function(v)
    {
      if(v === undefined)
      {
        return _certPath;
      }
      _certPath = (typeof v === 'string' ? v : _certPath);
      return Type;
    }

    Type.caPath = function(v)
    {
      if(v === undefined)
      {
        return _caPath;
      }
      _caPath = (typeof v === 'string' ? v : _caPath);
      return Type;
    }

    Type.requestCert = function(v)
    {
      if(v === undefined)
      {
        return _requestCert;
      }
      _requestCert = !!v;
      return Type;
    }

    Type.rejectUnauthorized = function(v)
    {
      if(v === undefined)
      {
        return _rejectUnauthorized;
      }
      _rejectUnauthorized = !!v;
      return Type;
    }

    Type.key = function(v)
    {
      return _key;
    }

    Type.cert = function(v)
    {
      return _cert;
    }

    Type.ca = function(v)
    {
      return _ca;
    }

    return Type;
  }
  return CreateType;
}(fs_module));

