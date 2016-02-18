/* Init Initializes Master and starts entire process */
var Init = require('./core_modules/Init')()
/* Fetch all the settings so they can be passed down the chain to the modules that need it */
  , settings = require('./settings/main.json');
    settings.alias = require('./settings/alias.json');
    settings.database = require('./settings/database.json');
    settings.server = require('./settings/server.json');
    settings.server_modules = require('./settings/server_modules.json');
    settings.site_modules = require('./settings/site_modules.json');
    settings.smtp = require('./settings/smtp.json');
    settings.vhost = require('./settings/vhost.json');

Init(settings);
