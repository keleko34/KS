//done
var host_module = require('./_Host/Host')
  , fs_module = require('fs');

module.exports = (function(fs,CreateHost){
  function CreateHosts()
  {
    var _hosts = {}
      , _path = '';

    function Hosts()
    {
      fs.readdir(_path,function(err,dir){
        if(!err)
        {
          for(var x=0;x<dir.length;x+=1)
          {
            if(_hosts[dir[x]] === undefined)
            {
              _hosts[dir[x]] = CreateHost()
              .path(_path+'/'+dir[x])
              .host(dir[x]).call();
            }
          }
        }
        else
        {
          //In the future we will request an input if the user would like to create a default settings here
          Console.Error("ERR: ",_path,' Does not exist or is not the correct settings path, please fix the settings path to match this');
          switch(ksprocess.env())
          {
            case 'master':
              ksprocess.killAll();
            break;
            case 'Thread':
              ksprocess.send({command:'kill',data:{type:'all'}});
            break;
            case 'Fork':
              ksprocess.send({command:'kill',data:{type:'all'}});
            break;
          }
        }
      });
    }

    Hosts.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Hosts;
    }

    Hosts.hosts = function()
    {
      return _hosts;
    }

    Hosts.getHost = function(h)
    {
      return _hosts[h];
    }

    Hosts.addHost = function(h)
    {
      if(_hosts[h] === undefined)
      {
        _hosts[h] = CreateHost()
        .path(_path+'/'+h)
        .host(h).call();
      }
      return Hosts;
    }

    Hosts.removeHost = function(h)
    {
      _hosts[h] = null;
      delete hosts[h];
      return Hosts;
    }

    Hosts.getConfig = function(h,v)
    {
      if(_hosts[h] && _hosts[h][v])
      {
        return _hosts[h][v]();
      }
      return null;
    }

    return Hosts;
  }
  return CreateHosts;
}(fs_module,host_module));
