module.exports = (function(){
  function CreateModule()
  {
    var _path = ''
      , _load = true
      , _isLoaded = false
      , _isValid = true
      , _invalidVersion = 0
      , _version = 0
      , _description = ''
      , _fullpath = ''
      , _packagePath = ''
      , _package = {}

    function Module()
    {
      if(_isValid || _version !== _invalidVersion)
      {
        try
        {
          _isValid = true;
          _fullpath = require.resolve(_path);
        }
        catch(e)
        {
          if(e.code === "MODULE_NOT_FOUND" && process.send !== undefined)
          {
            process.send({command:"debug","data":{"msg":"\033[91m"+e.code+" Module: \033[39m"+_path}});
          }
          _isValid = false;
          _invalidVersion = _version;
        }
        if(_isValid && _load)
        {
          //always reload
          _packagePath = _fullpath.substring(0,(_fullpath.indexOf(_path)+_path.length))+"/package.json";

          _package = {};
          require.cache[_packagePath] = null;
          delete require.cache[_packagePath];
          _package = require(_packagePath);
          if(_package.version !== _version)
          {
            require.cache[_fullpath] = null;
            delete require.cache[_fullpath];
          }
          _version = _package.version;
          _description = _package.description;
          _isLoaded = true;
          require(_path);
        }
        else if(!_load && require.cache[_fullpath] !== undefined)
        {
          _package = {};
          require.cache[_packagePath] = null;
          delete require.cache[_packagePath];

          require.cache[_fullpath] = null;
          delete require.cache[_fullpath];

          _version = 0;
          _description = '';
          _isLoaded = false;
        }
      }
    }

    Module.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Module;
    }

    Module.load = function(v)
    {
      if(v === undefined)
      {
        return _load;
      }
      _load = !!v;
      return Module;
    }

    Module.isLoaded = function()
    {
      return _isLoaded;
    }

    Module.isValid = function()
    {
      return _isValid;
    }

    Module.invalidVersion = function()
    {
      return _invalidVersion;
    }

    Module.version = function()
    {
      return _version;
    }

    Module.description = function()
    {
      return _description;
    }

    Module.package = function()
    {
      return _package;
    }

    return Module;
  }
  return CreateModule;
}());
