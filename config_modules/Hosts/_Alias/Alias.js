var querystring_module = require('querystring')
  , path_module = require('path')

module.exports = (function(querystring,path){
  function CreateAlias()
  {
    var _redirectPath = ''
      , _path = ''
      , _includeSubs = false
      , _base = ''
      , _query = {}

    function Alias()
    {
      if(_redirectPath.indexOf('*') > -1)
      {
        _includeSubs = true;
        _redirectPath.replace('*','');
      }
      _query = querystring.parse(path.parse(_path).query);
      _base = path.parse(_path).base;
      _path = _path.substring(0,(_path.indexOf('?') > -1 ? _path.indexOf('?') : _path.length)).replace(_base,"");
    }

    Alias.redirectPath = function(v)
    {
      if(v === undefined)
      {
        return _redirectPath;
      }
      _redirectPath = (typeof v === 'string' && v.indexOf("/") === 0 ? v : _redirectPath);
      return Alias;
    }

    Alias.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' && v.indexOf("/") === 0 ? v : _path);
      return Alias;
    }

    Alias.includeSubs = function()
    {
      return _includeSubs;
    }

    Alias.base = function()
    {
      return _base;
    }

    Alias.query = function()
    {
      return _query;
    }

    return Alias;
  }
  return CreateAlias;
}(querystring_module,path_module));
