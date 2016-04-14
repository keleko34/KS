var jsonfile_module = require('jsonfile')
  , fs_module = require('fs');

module.exports = (function(fs,jsonfile){
  function CreateContentTypes()
  {
    var _path = ''
      , _config = {}

    function ContentTypes()
    {
      _config = jsonfile.readFileSync(_path);
    }

    ContentTypes.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return ContentTypes;
    }

    ContentTypes.config = function()
    {
      return _config;
    }

    ContentTypes.update = function()
    {
      jsonfile.writeFileSync(_config);
    }

    return ContentTypes;
  }
  return CreateContentTypes;
}(fs_module,jsonfile_module));
