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
      , _onChange = function(){}
      , _isValid = true
      , _onError = function(){}
      , _inValidHash = ''
      , _fullpath = ''
      , _hash = ''

    function Module()
    {
      _fullpath = process.cwd().replace(/\//g,"/")+_base+"/"+_title+"/"+_title+".js";
      var md5 = crypto.createHash('md5');
      try
      {
        md5 = md5.update(fs.readFileSync(_fullpath),'utf8').digest('hex');
      }
      catch(e)
      {
        if(e.code === 'ENOENT' && process.send !== undefined)
        {
          process.send({"command":"debug","data":{"msg":"\033[91m"+e.code+" Site Module: \033[39m"+_title}});
        }
        _isValid = false;
        _onError(Module);
      }
      if(typeof md5 === 'string' && _hash !== md5)
      {
        _hash = md5;
        _inValidHash = '';
        _isChanged = true;
        _isValid = true;
        _load = true;
        _isLoaded = false;
        _onChange(Module);
      }
      else if(typeof md5 === 'string' && !_isValid)
      {
        _load = false;
        _inValidHash = _hash;
        _onError(Module);
      }
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

    Module.onChange = function(v)
    {
      if(v === undefined)
      {
        return _onChange;
      }
      _onChange = (typeof v === 'function' ? v : _onChange);
      return Module;
    }

    Module.onError = function(v)
    {
      if(v === undefined)
      {
        return _onError;
      }
      _onError = (typeof v === 'function' ? v : _onError);
      return Module;
    }

    Module.inValidHash = function(v)
    {
      return _inValidHash;
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
