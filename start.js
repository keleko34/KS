/* Init Initializes Master and starts entire process */
var CreateInit = require('./core_modules/Init')
/* Fetch all the settings so they can be passed down the chain to the modules that need it */
  , settings = {};
    settings.server = require('./settings/main.json');
    settings.server_modules = require('./settings/server_modules.json');
    settings.vhost = require('./settings/vhost.json');
    settings.sites = {};
    Object.keys(settings.vhost).forEach(function(s,i){
      settings.sites[s] = {};
      settings.sites[s].alias = require('./settings/hosts/'+s+'/alias.json');
      settings.sites[s].database = require('./settings/hosts/'+s+'/database.json');
      settings.sites[s].site_modules = require('./settings/hosts/'+s+'/site_modules.json');
      settings.sites[s].smtp = require('./settings/hosts/'+s+'/smtp.json');
      settings.sites[s].app = require('./settings/hosts/'+s+'/app.json');
      settings.sites[s].content_types = require('./settings/hosts/'+s+'/content_types.json');
      settings.sites[s].firewall = require('./settings/hosts/'+s+'/firewall.json');
    });
global.config = settings;
CreateInit().call(global);
