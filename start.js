/* Init Initializes Master and starts entire process */
var Init = require('./core_modules/Init')()
/* Fetch all the settings so they can be passed down the chain to the modules that need it */
  , settings = require('./settings.json')
Init(settings);
