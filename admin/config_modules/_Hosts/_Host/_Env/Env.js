//done
var jsonfile_module = require('jsonfile')
  , fs_module = require('fs')
  , rmdir_module = require('rmdir');

module.exports = (function(fs,jsonfile,rmdir){
  function CreateEnv()
  {
    var _path = ''
      , _config = {}
      , _host = ''

    function Env()
    {
      _config = jsonfile.readFileSync(_path);
    }

    Env.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Env;
    }

    Env.host = function(v)
    {
      if(v === undefined)
      {
        return _host;
      }
      _host = (typeof v === 'string' ? v : _host);
      return Env;
    }

    Env.config = function()
    {
      return _config;
    }

    Env.update = function()
    {
      jsonfile.writeFileSync(_path,_config,{spaces:1});
    }

    Env.addEnv = function(env,path)
    {
      if(!path)
      {
        path = "/"+env;
      }
      _config[env] = path;
      Env.update();
      fs.mkdir(ksprocess.base()+'/view/'+_host+"/"+env,function(err){
        if(err && err.code !== 'EEXIST')
        {
          Env.removeEnv(env);
        }
      });
    }

    Env.removeEnv = function(env)
    {
      delete _config[env];
      Env.update();
      rmdir(ksprocess.base()+'/view/'+_host+"/"+env);
    }

    return Env;
  }
  return CreateEnv;
}(fs_module,jsonfile_module,rmdir_module));
