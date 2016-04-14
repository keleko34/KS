var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(fs,jsonfile){
  function CreateAlias()
  {
    var _path = ''
      , _config = {}

    function Alias()
    {
      _config = jsonfile.readFileSync(_path);
    }

    Alias.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Alias;
    }

    Alias.config = function()
    {
      return _config;
    }

    Alias.update = function()
    {
      jsonfile.writeFileSync(_config);
    }

    return Alias;
  }
  return CreateAlias;
}(fs_module,jsonfile_module));
