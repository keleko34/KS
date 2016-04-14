var jsonfile_module = require('jsonfile')
  , rmdir_module = require('rmdir')
  , ncp_module = require('ncp').ncp
  , fs_module = require('fs')

module.exports = (function(jsonfile,fs,rmdir,ncp){
  function CreateVhost()
  {
    var _path = ''
      , _config = {}

    function Vhost(cb)
    {
      _config = jsonfile.readFileSync(_path);
    }

    Vhost.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Vhost;
    }

    Vhost.config = function()
    {
      return _config;
    }

    Vhost.update = function()
    {
      jsonfile.writeFileSync(_path,_config,{space:1});
    }

    //create app directory and all environments, create settings folder as well
    Vhost.addHost = function(h,cb)
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
          Vhost.update();
          if(typeof cb === 'function')
          {
            cb();
          }
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
          if(!err || err.code === 'EEXIST')
          {
            fs.mkdir(ksprocess.base()+'/view/'+h+'/app',function(err){
              if(!err || err.code === 'EEXIST')
              {
                checks.app = true;
                check();
              }
              else
              {
                Vhost.removeHost(h,true);
              }
            });

            fs.mkdir(ksprocess.base()+'/view/'+h+'/dev',function(err){
              if(!err || err.code === 'EEXIST')
              {
                checks.dev = true;
                check();
              }
              else
              {
                Vhost.removeHost(h,true);
              }
            });

            fs.mkdir(ksprocess.base()+'/view/'+h+'/qa',function(err){
              if(!err || err.code === 'EEXIST')
              {
                checks.qa = true;
                check();
              }
              else
              {
                Vhost.removeHost(h,true);
              }
            });
          }
          else
          {
            Vhost.removeHost(h,true);
          }
        });

        //settings dir
        ncp.limit = 16;
        fs.mkdir(ksprocess.base()+'/settings/hosts/'+h,function(err){
          if(!err || err.code === 'EEXIST')
          {
            fs.readdir(ksprocess.base()+'/admin/templates/config/host',function(err,dir){
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
                  ncp(ksprocess.base()+'/admin/templates/config/host/'+dir[x],ksprocess.base()+'/settings/hosts/'+h+'/'+dir[x],function(err){
                    if(!err || err.code === 'EEXIST')
                    {
                      finCount += 1;
                      finCb();
                    }
                    else
                    {
                      Vhost.removeHost(h,true);
                    }
                  });
                }
              }
              else
              {
                console.log('dir reading error',err);
              }
            });
          }
          else
          {
            Vhost.removeHost(h,true);
          }
        });
      }
      return Vhost;
    }

    //this will recursively remove all view files and settings files
    Vhost.removeHost = function(h,err,cb)
    {
      if(_config[h] !== undefined || err === true)
      {
        var rView = false
          , rSettings = false
          , finRem = function()
          {
            if(rView && rSettings)
            {
              delete _config[h];
              Vhost.update();
              if(typeof err === 'function')
              {
                err();
              }
              else if(typeof cb === 'function')
              {
                cb();
              }
            }
          }

        rmdir(ksprocess.base()+'/view/'+h,function(err){
          if(!err || err.code === 'ENOENT')
          {
            rView = true;
            finRem();
          }
          else
          {
            console.log(err)
          }
        })

        rmdir(ksprocess.base()+'/settings/hosts/'+h,function(err){
          if(!err || err.code === 'ENOENT')
          {
            rSettings = true;
            finRem();
          }
          else
          {
            console.log(err)
          }
        })
      }
      return Vhost;
    }

    return Vhost;
  }
  return CreateVhost;
}(jsonfile_module,fs_module,rmdir_module,ncp_module));
