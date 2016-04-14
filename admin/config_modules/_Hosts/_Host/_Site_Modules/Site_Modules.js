var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(fs,jsonfile){
  function CreateSiteModules()
  {
    var _path = ''
      , _config = {}

    function SiteModules()
    {
      _config = jsonfile.readFileSync(_path);
    }

    SiteModules.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return SiteModules;
    }

    SiteModules.config = function()
    {
      return _config;
    }

    SiteModules.update = function()
    {
      jsonfile.writeFileSync(_path,_config,{spaces:1});
    }

    return SiteModules;
  }
  return CreateSiteModules;
}(fs_module,jsonfile_module));
