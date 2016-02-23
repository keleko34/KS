var fs_module = require('fs')
  , path_module = require('path');

module.exports = (function(fs,path){
  function CreateFile()
  {
    var _ext = ''
      , _path = ''
      , _exists = false
      , _base = 'C:/'

    function File()
    {
      var currentDirectory = File.base()
        , foundError = false;
      File.path().dir.split('/',(File.path().dir.length)).forEach(function(d,i){
        if(!foundError)
        {
          currentDirectory = currentDirectory+(currentDirectory.lastIndexOf('/') !== (currentDirectory.length-1) ? '/' : '')+d;

          File.checkDirectory(currentDirectory,function(){
              if(i >= (File.path().dir.split('/',(File.path().dir.length)).length-1))
              {
                File.exists(function(){
                  File.callback()
                  .call(File,fs.createReadStream(File.base()+File.path().dir+(File.path().dir.length > 1 ? "/" : "")+File.path().base)
                        , undefined
                        , File.path().ext.replace('.',''))
                },function(err){
                  File.callback()(undefined,err,'html');
                })
              }
          },function(err){
            foundError = true;
            File.callback()(undefined,err,'html');
          });
        }
      });
    }

    File.ext = function(t)
    {
      if(t === undefined)
      {
        return _ext;
      }
      _ext = (typeof t === 'string' ? t : _ext);
      return File;
    }

    File.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = (typeof b === 'string' && b.indexOf(process.cwd().replace(/\\/g,"/")) > -1 ? b : _base);
      return File;
    }

    File.path = function(p)
    {
      if(p === undefined)
      {
        return _path;
      }
      _path = (typeof p === 'object' && p.dir !== undefined ? p : _path);
      return File;
    }

    File.callback = function(c)
    {
      if(c === undefined)
      {
        return _callback;
      }
      _callback = (typeof c === 'function' ? c : _callback);
      return File;
    }

    File.checkDirectory = function(dir,cb,err)
    {
      fs.readdir(dir,function(error,files){
        if(!error)
        {
          if(files.indexOf((File.base().substring((File.base().lastIndexOf('/')+1),File.base().length))) < 0)
          {
            cb();
          }
          else
          {
            err(500);
          }
        }
        else
        {
          err(404);
        }
      })
    }

    File.exists = function(cb,err)
    {
      if(File.ext().length < 1)
      {
        File.path(path.parse(File.path().dir+(File.path().dir.length > 1 ? "/" : "")+File.path().base+'/index.html'));
      }
      fs.stat(File.base()+File.path().dir+(File.path().dir.length > 1 ? "/" : "")+File.path().base,function(error,stats){
        if(!error)
        {
          if(stats.isFile())
          {
            cb();
          }
          else
          {
            err(404);
          }
        }
        else
        {
          err(404);
        }
      });
    }

    return File;
  }
  return CreateFile;
}(fs_module,path_module));
