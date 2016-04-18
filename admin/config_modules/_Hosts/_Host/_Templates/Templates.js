var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(fs,jsonfile){
  function CreateTemplates()
  {
    var _path = ''
      , _config = {}

    function Templates()
    {
      _config = jsonfile.readFileSync(_path);
    }

    Templates.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Templates;
    }

    Templates.config = function()
    {
      return _config;
    }

    Templates.update = function()
    {
      jsonfile.writeFileSync(_path,_config,{spaces:1});
    }

    return Templates;
  }
  return CreateTemplates;
}(fs_module,jsonfile_module));
