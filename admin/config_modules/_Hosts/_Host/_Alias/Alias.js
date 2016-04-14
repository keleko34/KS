//done
var jsonfile_module = require('jsonfile')
  , fs_module = require('fs')
  , url_module = require('url')

module.exports = (function(fs,jsonfile,url){
  function CreateAlias()
  {
    var _path = ''
      , _config = {}

    function Alias()
    {
      _config = jsonfile.readFileSync(_path);
    }

    Alias.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Alias;
    }

    Alias.config = function()
    {
      return _config;
    }

    Alias.update = function()
    {
      jsonfile.writeFileSync(_config);
    }

    Alias.addAlias = function(alias,redirect,subs)
    {
      if(_config[alias+(subs ? '*' : '')] === undefined)
      {
        _config[alias+(subs ? '*' : '')] = redirect;
        Alias.update();
      }
    }

    Alias.removeAlias = function(alias)
    {
      if(_config[alias] !== undefined)
      {
        delete _config[alias];
        Alias.update();
      }
      else if(_config[alias+'*'] !== undefined)
      {
        delete _config[alias+'*'];
        Alias.update();
      }
    }

    /* accepts a path without queries, note queries cant be aliased but can be added from direct alias paths, not subs included paths,
    in future allow queries to be sorted here as well
    Note: some returned paths may need querystring parsed again */
    Alias.checkAlias(path)
    {
      if(_config[path] !== undefined)
      {
        return _config[path];
      }
      else
      {
        var AKeys = Object.keys(_config);
          , x = 0;
        for(x;x<AKeys.length;x+=1)
        {
          if(AKeys[x].indexOf('*') > -1)
          {
            var subAPath = AKeys[x].substring(0,(AKeys[x].length-1));
            if(path.indexOf(subAPath)  > -1)
            {
              var rep = _config[AKeys[x]]
                , query = url.parse(_config[AKeys[x]]).query
                , pathQuery = url.parse(path).query;
              if(query !== null)
              {
                rep = rep.replace('?'+query,'');
              }
              if(pathQuery !== null)
              {
                path = path.replace('?'+pathQuery,'');
              }
              return path.replace(subAPath,_config[AKeys[x]]).replace(/\/\//g,'/')+(pathQuery !== null ? '?'+pathQuery : '')+(query !== null ? (pathQuery === null ? '?' : '')+query : '');
            }
          }
        }
      }
      return path;
    }

    return Alias;
  }
  return CreateAlias;
}(fs_module,jsonfile_module,url_module));
