var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(fs,jsonfile){
  function CreateApp()
  {
    var _path = ''
      , _config = {}

    function App()
    {
      _config = jsonfile.readFileSync(_path);
    }

    App.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return App;
    }

    App.config = function()
    {
      return _config;
    }

    App.update = function()
    {
      jsonfile.writeFileSync(_config);
    }

    return App;
  }
  return CreateApp;
}(fs_module,jsonfile_module));
