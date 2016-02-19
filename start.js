/* Init Initializes Master and starts entire process */
var Init = require('./core_modules/Init')()
/* Fetch all the settings so they can be passed down the chain to the modules that need it */
  , settings = require('./settings/main.json');
    settings.server = require('./settings/server.json');
    settings.server_modules = require('./settings/server_modules.json');
    settings.vhost = require('./settings/vhost.json');
    settings.sites = {};
    Object.keys(settings.vhost).forEach(function(s,i){
      settings.sites[s] = {};
      settings.sites[s].alias = require('./sites/'+s+'/settings/alias.json');
      settings.sites[s].database = require('./sites/'+s+'/settings/database.json');
      settings.sites[s].site_modules = require('./sites/'+s+'/settings/site_modules.json');
      settings.sites[s].smtp = require('./sites/'+s+'/settings/smtp.json');
    });

Init(settings);
