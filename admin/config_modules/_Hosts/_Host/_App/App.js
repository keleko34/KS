var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(fs,jsonfile){
  function CreateApp()
  {
    var _path = ''
      , _config = {}
      , _base = '/app'
      , _admin = true
      , _cached = true
      , _firewall = true
      , _logging = false
      , _directory = false
      , _fileFilter = true
      , _restHTTP = false
      , _restWebSockets = false

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
      jsonfile.writeFileSync(_path,_config,{spaces:1});
    }

    App.base = function(v)
    {
      if(v === undefined)
      {
        return _base;
      }
      if(typeof v === 'string' && v.indexOf('/') === 0 && v !== _base)
      {
        _base = v;
        _config.base = v;
        App.update();
      }
      return App;
    }

    App.admin = function(v)
    {
      if(v === undefined)
      {
        return _admin;
      }
      if(v !== _admin)
      {
        _admin = !!v;
        _config.admin = !!v;
        App.update();
      }
      return App;
    }

    App.cached = function(v)
    {
      if(v === undefined)
      {
        return _cached;
      }
      if(v !== _cached)
      {
        _cached = !!v;
        _config.cached = !!v;
        App.update();
      }
      return App;
    }

    App.firewall = function(v)
    {
      if(v === undefined)
      {
        return _firewall;
      }
      if(v !== _firewall)
      {
        _firewall = !!v;
        _config.firewall = !!v;
        App.update();
      }
      return App;
    }

    App.logging = function(v)
    {
      if(v === undefined)
      {
        return _logging;
      }
      if(v !== _logging)
      {
        _logging = !!v;
        _config.logging = !!v;
        App.update();
      }
      return App;
    }

    App.directory = function(v)
    {
      if(v === undefined)
      {
        return _directory;
      }
      if(v !== _directory)
      {
        _directory = !!v;
        _config.directory = !!v;
        App.update();
      }
      return App;
    }

    App.fileFilter = function(v)
    {
      if(v === undefined)
      {
        return _fileFilter;
      }
      if(v !== _fileFilter)
      {
        _fileFilter = !!v;
        _config.fileFilter = !!v;
        App.update();
      }
      return App;
    }

    App.restHTTP = function(v)
    {
      if(v === undefined)
      {
        return _restHTTP;
      }
      if(v !== _restHTTP)
      {
        _restHTTP = !!v;
        _config.rest.http = !!v;
        App.update();
      }
      return App;
    }

    App.restWebSockets= function(v)
    {
      if(v === undefined)
      {
        return _restWebSockets;
      }
      if(v !== _restWebSockets)
      {
        _restWebSockets = !!v;
        _config.rest.websockets = !!v;
        App.update();
      }
      return App;
    }

    return App;
  }
  return CreateApp;
}(fs_module,jsonfile_module));
