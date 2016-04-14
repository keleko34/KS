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
      jsonfile.writeFileSync(_config);
    }

    return Firewall;
  }
  return CreateFirewall;
}(fs_module,jsonfile_module));
