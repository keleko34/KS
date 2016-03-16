var fs_module = require('fs')
  , crypto_module = require('crypto');

module.exports = (function(fs,crypto){
  function CreateModule()
  {
    var _title = ''
      , _base = '/site_modules'
      , _load = true
      , _isLoaded = false
      , _isChanged = false
      , _isValid = true
      , _fullpath = ''
      , _hash = ''

    function Module()
    {

    }

    Module.title = function(v)
    {
      if(v === undefined)
      {
        return _title;
      }
      _title = (typeof v === 'string' ? v : _title);
      return Module;
    }

    Module.base = function(v)
    {
      if(v === undefined)
      {
        return _base;
      }
      _base = (typeof v === 'string' && v.indexOf("/") === 0 ? v : _base);
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

    Module.isChanged = function(v)
    {
      if(v === undefined)
      {
        return _isChanged;
      }
      _isChanged = !!v;
      return Module;
    }

    Module.isValid = function(v)
    {
      if(v === undefined)
      {
        return _isValid;
      }
      _isValid = !!v;
      return Module;
    }

    Module.isLoaded = function()
    {
      return _isLoaded;
    }

    Module.fullpath = function()
    {
      return _fullpath;
    }

    Module.hash = function()
    {
      return _hash;
    }

    return Module;
  }
  return CreateModule;
}(fs_module,crypto_module));
