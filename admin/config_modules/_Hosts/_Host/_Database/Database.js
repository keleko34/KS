//done
var jsonfile_module = require('jsonfile')
  , fs_module = require('fs')
  , dns_module = require('dns');

module.exports = (function(fs,jsonfile,dns){
  function CreateDatabase()
  {
    var _path = ''
      , _config = {}
      , _defaultTypeEnum = ['mongodb','redis','mysql']
      , _defaultPortEnum = [27017,6379,3306]

    function Database()
    {
      _config = jsonfile.readFileSync(_path);
    }

    Database.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Database;
    }

    Database.config = function()
    {
      return _config;
    }

    Database.update = function()
    {
      jsonfile.writeFileSync(_path,_config,{spaces:1});
    }

    Database.check = function(address,type,port,cb)
    {
      if(typeof port === 'function')
      {
        cb = port;
        port = 0;
      }
      if(address.indexOf(':') > -1)
      {
        _portReg = /(:)[^/.:A-Za-z]+/i;
        port = parseInt(_portReg.exec(address),10);
        address = address.replace(_portReg,"");
      }
      else if(_defaultPortEnum.indexOf(port) > -1)
      {
        port = _defaultPortEnum[_typeEnum.indexOf(type)];
      }


      dns.resolve(address,'A',function(e,ipList){
        console.log(ipList);
        if(e && e.code === 'ENOENT' && process.send !== undefined)
        {
          process.send({"command":"debug","data":{"msg":"\033[91m"+e.code+" Database Url: \033[39m"+address}});
          cb(e,false);
        }
        else if(!e && !ipList)
        {
          cb(e,false);
        }
        else if(!e && ipList)
        {
          cb(e,true);
        }
      });
    }

    Database.addDB = function(name,options)
    {
      if(options.type !== undefined && options.address !== undefined && options.dbname !== undefined)
      {
        Database.check(options.address,options.type,function(e,exists){
          if(exists)
          {
            _config[name] = {
              type:options.type,
              address:options.address,
              dbname:options.dbname,
              user:options.user,
              pass:options.pass
            };
            Database.update();
          }
        });
      }
      return Database;
    }

    Database.removeDB = function(name)
    {
      if(_config[name] !== undefined)
      {
        _config[name] = null;
        delete _config[name];
        Database.update();
      }
      return Database;
    }

    return Database;
  }
  return CreateDatabase;
}(fs_module,jsonfile_module,dns_module));
