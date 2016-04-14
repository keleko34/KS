module.exports = (function(){
  function CreateTemplates()
  {
    var _config = {};

    function Templates(c)
    {
      _config = c;
    }

    Templates.config = function()
    {
      return _config;
    }

    return Templates;
  }
  return CreateTemplates;
}());
