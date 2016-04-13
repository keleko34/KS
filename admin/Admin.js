/* Admin will control all dynamic and extendable information, the reasoning behind this is that admin folder will allow for remote updates so
   if something gets updated or new content is added to the project a user of KS can simply do an update on the admin panel and get all the new
   content or fixes */

var ksprocess_module = require('./process/Process')
  , config_module = require('./config_modules/Config');

module.exports = (function(CreateKSProcess,CreateConfig){
  function CreateAdmin()
  {
    var _config = CreateConfig();

    function Admin()
    {
      //create global process commands/helpers
      global.ksprocess = CreateKSProcess().module(process.module());

      //set up configs, configs when updated will auto update json files as well, so path is crucial to app
      _config.path('/settings').call();
    }

    Admin.config = function()
    {
      return config;
    }

    Admin.getConfig = function(filter,host)
    {
      if(!host)
      {
        switch(filter)
        {
          case 'main':
            return config.main();
          case 'server_modules':
            return config.serverMdoules();
          case 'vhost':
            return config.vhost();
          case 'hosts':
            return config.hosts();
        }
      }
      else
      {
        return config.hosts().getConfig(host,filter);
      }
    }

    return Admin;
  }
  return CreateAdmin;
}(ksprocess_module,config_module));
