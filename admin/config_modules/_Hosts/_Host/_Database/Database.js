var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(fs,jsonfile){
  function CreateDatabase()
  {
    var _path = ''
      , _config = {}

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
      jsonfile.writeFileSync(_config);
    }

    return Database;
  }
  return CreateDatabase;
}(fs_module,jsonfile_module));
