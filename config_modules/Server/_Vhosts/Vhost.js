var fs_module = require('fs');

module.exports = (function(fs){
  function CreateVhost()
  {
    var _address = ''
      , _path = ''
      , _stats = {}
      , _exists = false

    function Vhost()
    {
      try
      {
        console.log(process.cwd().replace(/\\/g,"/"));
        _stats = fs.statSync(process.cwd().replace(/\\/g,"/")+"/view"+_path);
        _exists = true;
      }
      catch(e)
      {
        if(e.code === "ENOENT" && process.send !== undefined)
        {
          _exists = false;
          process.send({"command":"debug","data":{"msg":"\033[91m"+e.code+" Missing Base Site Path: \033[39m"+_path}});
        }
      }
      if(_stats.isDirectory !== undefined && !_stats.isDirectory() && process.send !== undefined)
      {
        _exists = false;
        process.send({"command":"debug","data":{"msg":"\033[91m"+e.code+" Base Site Path Is Not Of Type Folder: \033[39m"+_path}});
      }
    }

    Vhost.address = function(v)
    {
      if(v === undefined)
      {
        return _address;
      }
      _address = (typeof v === 'string' ? v : _address);
      return  Vhost;
    }

    Vhost.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return  Vhost;
    }

    Vhost.exists = function()
    {
      return _exists;
    }

    Vhost.stats = function()
    {
      return _stats;
    }

    return Vhost;
  }
  return CreateVhost;
}(fs_module));
