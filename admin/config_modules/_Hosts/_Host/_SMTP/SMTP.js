var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(fs,jsonfile){
  function CreateSMTP()
  {
    var _path = ''
      , _config = {}

    function SMTP()
    {
      _config = jsonfile.readFileSync(_path);
    }

    SMTP.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return SMTP;
    }

    SMTP.config = function()
    {
      return _config;
    }

    SMTP.update = function()
    {
      jsonfile.writeFileSync(_config);
    }

    return SMTP;
  }
  return CreateSMTP;
}(fs_module,jsonfile_module));
