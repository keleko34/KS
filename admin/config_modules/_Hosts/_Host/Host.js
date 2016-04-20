//done
var app_module = require('./_App/App')
  , alias_module = require('./_Alias/Alias')
  , content_types_module = require('./_Content_Types/Content_Types')
  , database_module = require('./_Database/Database')
  , firewall_module = require('./_Firewall/Firewall')
  , env_module = require('./_Env/Env')
  , templates_module = require('./_Templates/Templates')
  , site_modules_module = require('./_Site_Modules/Site_Modules')
  , smtp_module = require('./_SMTP/SMTP')
  , fs_module = require('fs');

module.exports = (function(fs,CreateApp,CreateAlias,CreateContentType,CreateDatabase,CreateFirewall,CreateSiteModules,CreateSMTP,CreateEnv,CreateTemplates){
  function CreateHost()
  {
    var _path = ''
      , _host = ''
      , _app = CreateApp()
      , _alias = CreateAlias()
      , _contentType = CreateContentType()
      , _database = CreateDatabase()
      , _firewall = CreateFirewall()
      , _siteModules = CreateSiteModules()
      , _smtp = CreateSMTP()
      , _env = CreateEnv()
      , _templates = CreateTemplates();

    function Host()
    {
      fs.stat(_path,function(err,stats){
        if(!err && stats.isDirectory())
        {
          _app.path(_path+'/app.json').call();

          _alias.path(_path+'/alias.json').call();

          _contentType.path(_path+'/content_type.json').call();

          _database.path(_path+'/database.json').call();

          _firewall.path(_path+'/firewall.json').call();

          _siteModules.path(_path+'/site_modules.json').call();

          _env.path(_path+'/env.json').host(_host).call();

          _templates.path(_path+'/env.json').host(_host).call();

          _smtp.path(_path+'/smtp.json').call();
        }
        else
        {
          //In the future we will request an input if the user would like to create a default settings here
          Console.Error("ERR: ",_path,' Does not exist or is not the correct settings path, please fix host '+_host);
        }
      });
    }

    Host.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Host;
    }

    Host.host = function(v)
    {
      if(v === undefined)
      {
        return _host;
      }
      _host = (typeof v === 'string' ? v : _host);
      return Host;
    }

    Host.app = function()
    {
      return _app;
    }

    Host.alias = function()
    {
      return _alias;
    }

    Host.content_type = function()
    {
      return _contentType;
    }

    Host.database = function()
    {
      return _database;
    }

    Host.firewall = function()
    {
      return _firewall;
    }

    Host.site_modules = function()
    {
      return _siteModules;
    }

    Host.smtp = function()
    {
      return _smtp;
    }

    Host.env = function()
    {
      return _env;
    }

    Host.templates = function()
    {
      return _templates;
    }

    return Host;
  }
  return CreateHost;
}(fs_module,app_module,alias_module,content_types_module,database_module,firewall_module,site_modules_module,smtp_module,env_module,templates_module));
