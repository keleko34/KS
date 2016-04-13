var jsonfile_module = require('jsonfile')
  , rmdir_module = require('rmdir')
  , ncp_module = require('ncp')
  , fs_module = require('fs')

module.exports = (function(jsonfile,fs,rmdir,ncp){
  function CreateVshost()
  {
    var _path = ''
      , _config = {}

    function Vshost()
    {
      jsonfile.readFile(_path,function(err,data){
        if(!err) _config = data;
      })
    }

    Vshost.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Vshost;
    }

    Vshost.config = function()
    {
      return _config;
    }

    Vshost.update = function()
    {
      jsonfile.writeFile(_path,_config,{space:1},function(err){
        if(err) console.log('ERR:','failed to save vhost config',err);
      })
    }

    //create app directory and all environments, create settings folder as well
    Vshost.addHost = function(h)
    {
      if(_config[h] === undefined)
      {
        var checks = {
          app:false,
          dev:false,
          qa:false,
          settings:false
        }
        , finished = function()
        {
          _config[h] = '/'+h;
          Vshost.update();
        }
        , check = function()
        {
          if(checks.app && checks.dev && checks.qa && checks.settings)
          {
            finished();
          }
        }

        //view directory
        fs.mkdir(ksprocess.base()+'/view/'+h,function(err){
          if(!err)
          {
            fs.mkdir(ksprocess.base()+'/view/'+h+'/app',function(err){
              if(!err)
              {
                checks.app = true;
                check();
              }
            });

            fs.mkdir(ksprocess.base()+'/view/'+h+'/dev',function(err){
              if(!err)
              {
                checks.dev = true;
                check();
              }
            });

            fs.mkdir(ksprocess.base()+'/view/'+h+'/qa',function(err){
              if(!err)
              {
                checks.qa = true;
                check();
              }
            });
          }
        });

        //settings dir
        fs.mkdir(ksprocess.base()+'/settings/hosts/'+h,function(err){
          if(!err)
          {
            fs.readDir(ksprocess.base()+'/admin/templates/config/host',function(err,dir){
              if(!err)
              {
                var finCount = 0,
                    finCb = function()
                {
                  if(finCount === dir.length)
                  {
                    checks.settings = true;
                    check();
                  }
                }
                //we will copy each file to settings
                for(var x=0;x<dir.length;x+=1)
                {
                  console.log(dir);

                }
              }
            });
          }
        });
      }
    }

    //this will rec remove all view files and settings files
    Vhost.removeHost = function(h)
    {
      if(_config[h] !== undefined)
      {
        rmdir(ksprocess.base()+'/view/'+h,function(err){
          if(!err)
          {
            delete _config[h];
            Vshost.update();
          }
        })
      }
    }

    return Vshost;
  }
  return CreateVshost;
}(jsonfile_module,fs_module,rmdir_module,ncp_module));
