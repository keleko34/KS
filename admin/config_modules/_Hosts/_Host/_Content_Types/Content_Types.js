//done
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
      jsonfile.writeFileSync(_path,_config,{spaces:1});
    }

    ContentTypes.addContentType = function(ext,type,encoding)
    {
      if(encoding !== null && ['text','binary'].indexOf(encoding) > -1)
      {
        config[ext.replace('.','')] = {type:type,encoding:encoding};
      }
      ContentTypes.update();
      return ContentTypes;
    }

    ContentTypes.removeContentType = function(ext)
    {
      if(_config[ext] !== undefined)
      {
        _config[ext] = null;
        delete _config[ext];
        ContentTypes.update();
      }
      return ContentTypes;
    }

    return ContentTypes;
  }
  return CreateContentTypes;
}(fs_module,jsonfile_module));
