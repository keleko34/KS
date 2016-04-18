var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(fs,jsonfile){
  function CreateEnv()
  {
    var _path = ''
      , _config = {}

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

    Env.config = function()
    {
      return _config;
    }

    Env.update = function()
    {
      jsonfile.writeFileSync(_path,_config,{spaces:1});
    }

    return Env;
  }
  return CreateEnv;
}(fs_module,jsonfile_module));
