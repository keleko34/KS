module.exports = (function(){
  function CreateApp()
  {
    var _host = ''
      , _config = {}
      , _base = '/app'
      , _admin = true
      , _cached = true
      , _firewall = true
      , _logging = false
      , _directory = true
      , _fileFilter = true
      , _rest = {}
      , _templates = {}
      , _env = {}

    function App()
    {

    }

    App.host = function(v)
    {
      if(v === undefined)
      {
        return _host;
      }
      _host = (typeof v === 'string' ? v : _host);
      return App;
    }

    App.config = function(v)
    {
      if(v === undefined)
      {
        return _config;
      }
      _config = (typeof v === 'object' ? v : _config);
      return App;
    }

    App.base = function(v)
    {
      if(v === undefined)
      {
        return _base;
      }
      _base = (typeof v === 'string' && v.indexOf('/') === 0 ? v : _base);
      return App;
    }



    return App;
  }
  return CreateApp;
}());
