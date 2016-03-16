var querystring_module = require('querystring')
  , path_module = require('path');

module.exports = (function(querystring,path){
  function CreateFirewall()
  {
    var _type = 'allow'
      , _typeEnum = ['allow','deny']
      , _path = ''
      , _includeSub = false
      , _base = ''
      , _query = {}
      , _ipTable = []

    function Firewall()
    {
      if(_path.indexOf('*') > -1)
      {
        _includeSub = true;
        _path = _path.replace("*","");
      }
      _query = querystring.parse(path.parse(_path).query);
      _base = path.parse(_path).base;
      _path = _path.substring(0,(_path.indexOf("?") > -1 ? _path.indexOf("?") : _path.length)).replace(_base,'');
    }

    Firewall.type = function(v)
    {
      if(v === undefined)
      {
        return _type;
      }
      _type = (_typeEnum.indexOf(v) > -1 ? v : _type);
      return Firewall;
    }

    Firewall.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' && v.indexOf("/") === 0 ? v : _path);
      return Firewall;
    }

    Firewall.ipTable = function(v)
    {
      if(v === undefined)
      {
        return _ipTable;
      }
      _ipTable = (v.constructor === Array ? v : _ipTable);
      return Firewall;
    }

    Firewall.addIp = function(ip)
    {
      if(typeof ip === 'string')
      {
        _ipTable.push(ip);
      }
    }

    Firewall.removeIp = function(ip)
    {
      if(typeof ip === 'string' && _ipTable.indexOf(ip) > -1)
      {
        _ipTable.splice(_ipTable.indexOf(ip),1);
      }
    }

    Firewall.includeSub = function()
    {
      return _includeSub;
    }

    Firewall.base = function()
    {
      return _base;
    }

    Firewall.query = function()
    {
      return _query;
    }

    return Firewall;
  }
  return CreateFirewall;
}(querystring_module,path_module));
