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
      settings.sites[s].alias = require('./settings/sites/'+s+'/alias.json');
      settings.sites[s].database = require('./settings/sites/'+s+'/database.json');
      settings.sites[s].site_modules = require('./settings/sites/'+s+'/site_modules.json');
      settings.sites[s].smtp = require('./settings/sites/'+s+'/smtp.json');
      settings.sites[s].app = require('./settings/sites/'+s+'/app.json');
    });

Init(settings);
