var modules_module = require('./_Modules/Module')
  , type_module = require('./_Type/Type')
  , vhost_module = require('./_Vhost/Vhost')
  , hosts_module = require('./_Hosts/Hosts');

module.exports = (function(CreateModule,CreateType,CreateVhost,CreateHost){
  function CreateServer()
  {
    var _nodeModules = {}
      , _http = CreateType()
      , _https = CreateType()
      , _http2 =  CreateType()
      , _vhosts = {}
      , _hosts = {}
      , _mainConfig = {}
      , _modulesConfig = {}
      , _vhostConfig = {}
      , _hostConfig = {}


    function Server()
    {
      if(typeof _mainConfig.http === "object")
      {
        _http.port(_mainConfig.http.port);
      }
      if(typeof _mainConfig.https === "object")
      {
        Object.keys(_mainConfig.https).forEach(function(k,i){
          if(_https[k] !== undefined && _mainConfig.https[k] !== undefined)
          {
            _https[k](_mainConfig.https[k]);
          }
        });
        _https.call();
      }
      if(typeof _mainConfig.http2 === "object")
      {
        Object.keys(_mainConfig.http2).forEach(function(k,i){
          if(_http2[k] !== undefined && _mainConfig.http2[k] !== undefined)
          {
            _http2[k](_mainConfig.http2[k]);
          }
        });
        _http2.call();
      }

      Object.keys(_modulesConfig).forEach(function(k,i){
        if(typeof _modulesConfig[k] === 'boolean')
        {
          _nodeModules[k] = CreateModule()
          .path(k)
          .load(_modulesConfig[k]);
          _nodeModules[k].call();
        }
      });

      Object.keys(_vhostConfig).forEach(function(k,i){
        if(typeof _vhostConfig[k] === 'string')
        {
          _vhosts[k] = CreateVhost()
          .address(k)
          .path(_vhostConfig[k]);
          _vhosts[k].call();

          _hosts[k] = CreateHost()
          .appConfig((_hostConfig[k].app !== undefined ? _hostConfig[k].app : {}))
          .aliasConfig((_hostConfig[k].alias !== undefined ? _hostConfig[k].alias : {}))
          .contentTypeConfig((_hostConfig[k].content_types !== undefined ? _hostConfig[k].content_types : {}))
          .databaseConfig((_hostConfig[k].database !== undefined ? _hostConfig[k].database : {}))
          .firewallConfig((_hostConfig[k].firewall !== undefined ? _hostConfig[k].firewall : {}))
          .threadConfig((_hostConfig[k].site_modules !== undefined ? _hostConfig[k].site_modules : {}))
          .smtpConfig((_hostConfig[k].smtp !== undefined ? _hostConfig[k].smtp : {}))
          _hosts[k].call();
        }
      });
    }

    Server.mainConfig = function(v)
    {
      if(v === undefined)
      {
        return _mainConfig;
      }
      _mainConfig = (typeof v === 'object' ? v : _mainConfig);
      return Server;
    }

    Server.modulesConfig = function(v)
    {
      if(v === undefined)
      {
        return _modulesConfig;
      }
      _modulesConfig = (typeof v === 'object' ? v : _modulesConfig);
      return Server;
    }

    Server.vhostConfig = function(v)
    {
      if(v === undefined)
      {
        return _vhostConfig;
      }
      _vhostConfig = (typeof v === 'object' ? v : _vhostConfig);
      return Server;
    }

    Server.hostConfig = function(v)
    {
      if(v === undefined)
      {
        return _hostConfig;
      }
      _hostConfig = (typeof v === 'object' ? v : _hostConfig);
      return Server;
    }

    Server.nodeModules = function(v)
    {
      return (typeof v === 'string' ? (_nodeModules[v] !== undefined ? (_nodeModules[v]) : null) : null);
    }

    Server.addNodeModule = function(v,active)
    {
      if(typeof v === 'string')
      {
        _modulesConfig[v] = !!active;
        Server.call();
      }
    }

    Server.removeNodeModule = function(v)
    {
      if(typeof v === 'string' && _modulesConfig[v] !== undefined)
      {
        _modulesConfig[v] = false;
        Server.call();
        _modulesConfig[v] = null;
        Server.call();
      }
    }

    Server.http = function()
    {
      return _http;
    }

    Server.https = function()
    {
      return _https;
    }

    Server.http2 = function()
    {
      return _http2;
    }

    Server.vhosts = function(v)
    {
      return (typeof v === 'string' ? (_vhosts[v] !== undefined ? (_vhosts[v]) : null) : null);
    }

    Server.hosts = function(v)
    {
      return (typeof v === 'string' ? (_hosts[v] !== undefined ? (_hosts[v]) : null) : null);
    }

    return Server;
  }
  return CreateServer;
}(modules_module,type_module,vhost_module,hosts_module));
