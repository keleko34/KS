//done
var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(fs,jsonfile){
  function CreateFirewall()
  {
    var _path = ''
      , _config = {}

    function Firewall()
    {
      _config = jsonfile.readFileSync(_path);
    }

    Firewall.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Firewall;
    }

    Firewall.config = function()
    {
      return _config;
    }

    Firewall.update = function()
    {
      jsonfile.writeFileSync(_path,_config,{spaces:1});
    }

    Firewall.addRule = function(url,type,ipList,includeSubs)
    {
      _config[ulr+(includeSubs ? "*" : "")] = {type:type,ip:ipList};
      Firewall.update();
    }

    Firewall.removeRule = function(url)
    {
      if(_config[url+"*"] !== undefined)
      {
        _config[url+"*"] = null;
        delete _config[url+"*"];
      }
      else
      {
        _config[url] = null;
        delete _config[url];
      }
      Firewall.update();
    }

    return Firewall;
  }
  return CreateFirewall;
}(fs_module,jsonfile_module));
