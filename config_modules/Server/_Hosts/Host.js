var app_module = require('./_App/App')
  , alias_module = require('./_Alias/Alias')
  , contenttype_module = require('./_ContentTypes/ContentTypes')
  , database_module = require('./_Database/Database')
  , firewall_module = require('./_Firewall/Firewall')
  , thread_module = require('./_Threads/Threads')
  , smtp_module = require('./_SMTP/SMTP');

module.exports = (function(CreateApp,CreateAlias,CreateContentType,CreateDatabase,CreateFirewall,CreateThread,CreateSMTP){
  function CreateHost()
  {
    var _app = {}
      , _alias = {}
      , _contentType = {}
      , _database = {}
      , _firewall = {}
      , _threads = {}
      , _smtp = {}

      , _appConfig = {}
      , _aliasConfig = {}
      , _contentTypeConfig = {}
      , _databaseConfig = {}
      , _firewallconfig = {}
      , _threadConfig = {}
      , _smtpConfig = {}

    function Host()
    {
      //App Section
      _app = CreateApp()
      .base((_appConfig.base !== undefined ? _appConfig.base : '/app'))
      .admin((_appConfig.admin !== undefined ? _appConfig.admin : true))
      .cached((_appConfig.cached !== undefined ? _appConfig.cached : true))
      .firewall((_appConfig.firewall !== undefined ? _appConfig.firewall : true))
      .logging((_appConfig.logging !== undefined ? _appConfig.logging : false))
      .directory((_appConfig.directory !== undefined ? _appConfig.directory : true))
      .fileFilter((_appConfig.fileFilter !== undefined ? _appConfig.fileFilter : true))
      .rest((_appConfig.rest !== undefined ? _appConfig.rest : {}))
      .templates((_appConfig.templates !== undefined ? _appConfig.templates : {}))
      .env((_appConfig.env !== undefined ? _appConfig.env : {}));
      _app.call();

      //Alias Section
      _alias = CreateAlias()

    }

    Host.hostConfig = function(v)
    {
      if(v === undefined)
      {
        return _hostConfig;
      }
      _hostConfig = (typeof v === 'object' ? v : _hostConfig);
    }

    Host.appConfig = function(v)
    {
      if(v === undefined)
      {
        return _appConfig;
      }
      _appConfig = (typeof v === 'object' ? v : _appConfig);
    }

    Host.aliasConfig = function(v)
    {
      if(v === undefined)
      {
        return _aliasConfig;
      }
      _aliasConfig = (typeof v === 'object' ? v : _aliasConfig);
    }

    Host.contentTypeConfig = function(v)
    {
      if(v === undefined)
      {
        return _contentTypeConfig;
      }
      _contentTypeConfig = (typeof v === 'object' ? v : _contentTypeConfig);
    }

    Host.databaseConfig = function(v)
    {
      if(v === undefined)
      {
        return _databaseConfig;
      }
      _databaseConfig = (typeof v === 'object' ? v : _databaseConfig);
    }

    Host.firewallConfig = function(v)
    {
      if(v === undefined)
      {
        return _firewallconfig;
      }
      _firewallconfig = (typeof v === 'object' ? v : _firewallconfig);
    }

    Host.threadConfig = function(v)
    {
      if(v === undefined)
      {
        return _threadConfig;
      }
      _threadConfig = (typeof v === 'object' ? v : _threadConfig);
    }

    Host.smtpConfig = function(v)
    {
      if(v === undefined)
      {
        return _smtpConfig;
      }
      _smtpConfig = (typeof v === 'object' ? v : _smtpConfig);
    }

    Host.app = function()
    {
      return _app;
    }

    Host.alias = function()
    {
      return _alias;
    }

    Host.contentType = function()
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

    Host.threads = function()
    {
      return _threads;
    }

    return Host;
  }
  return CreateHost;
}(app_module,alias_module,contenttype_module,database_module,firewall_module,thread_module,smtp_module));
