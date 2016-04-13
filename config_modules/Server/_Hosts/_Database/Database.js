var dns_module = require('dns');

module.exports = (function(dns){
  function CreateDatabase()
  {
    var _type = 'mongodb'
      , _typeEnum = ['mongodb','redis','mysql']
      , _address = ''
      , _dbname = ''
      , _user = ''
      , _pass = ''
      , _port = 27017
      , _defaultEnum = [27017,6379,3306]
      , _ip = ''

    function Database()
    {
      if(_address.indexOf(':') > -1)
      {
        _portReg = /(:)[^/.:A-Za-z]+/i;
        _port = parseInt(_portReg.exec(_address),10);
        _address = _address.replace(_portReg,"");
      }
      else if(_defaultEnum.indexOf(_port) > -1)
      {
        _port = _defaultEnum[_typeEnum.indexOf(_type)];
      }
      dns.resolve(_address,'A',function(e,ipList){
        if(e && e.code === 'ENOENT' && process.send !== undefined)
        {
          process.send({"command":"debug","data":{"msg":"\033[91m"+e.code+" Database Url: \033[39m"+_address}});
        }
        else if(!e)
        {
          _ip = ipList[0];
        }
      });
    }

    Database.type = function(v)
    {
      if(typeof v === undefined)
      {
        return _type;
      }
      _type = (_typeEnum.indexOf(v) > -1 ? v : _type);
      return Database;
    }

    Database.address = function(v)
    {
      if(typeof v === undefined)
      {
        return _address;
      }
      _address = (typeof v === 'string' ? v : _address);
      return Database;
    }

    Database.dbname = function(v)
    {
      if(typeof v === undefined)
      {
        return _dbname;
      }
      _dbname = (typeof v === 'string' ? v : _dbname);
      return Database;
    }

    Database.user = function(v)
    {
      if(typeof v === undefined)
      {
        return _user;
      }
      _user = (typeof v === 'string' ? v : _user);
      return Database;
    }

    Database.pass = function(v)
    {
      if(typeof v === undefined)
      {
        return _pass;
      }
      _pass = (typeof v === 'string' ? v : _pass);
      return Database;
    }

    Database.port = function()
    {
      return _port;
    }

    Database.ip = function()
    {
      return _ip;
    }

    return Database;
  }
  return CreateDatabase;
}(dns_module));
