var main_module = require('./_Main/Main')
  , vhost_module = require('./_Vhost/Vhost')
  , hosts_module = require('./_Hosts/Hosts')
  , fs_module = require('fs');

module.exports = (function(CreateMain,CreateVhost,CreateHosts,fs){
  function CreateConfig()
  {
    var _path = '/settings'
      , _main = CreateMain()
      , _vhost = CreateVhost()
      , _hosts = CreateHosts()

    function Config()
    {
      fs.stat(ksprocess.base()+_path,function(err,stats){
        if(!err && stats.isDirectory())
        {
          _main.path(ksprocess.base()+_path+'/main.json');
          _main.call();

          _vhost.path(ksprocess.base()+_path+'/vhost.json');
          _vhost.call();

          _hosts.path(ksprocess.base()+_path+'/hosts');
          _hosts.call();
        }
        else
        {
          //In the future we will request an input if the user would like to create a default settings here
          Console.Error("ERR: ",ksprocess.base()+_path,' Does not exist or is not the correct settings path, please fix the settings path to match this');
          switch(process.env())
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
      })
    }

    Config.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' && v.indexOf('/') ? v : _path);
      return Config;
    }

    Config.main = function()
    {
      return _main;
    }

    Config.vhost = function()
    {
      return _vhost;
    }

    Config.hosts = function()
    {
      return _hosts;
    }

    return Config;
  }
  return CreateConfig;
}(main_module,vhost_module,hosts_module,fs_module));
