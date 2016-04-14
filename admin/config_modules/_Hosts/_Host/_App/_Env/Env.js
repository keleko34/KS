module.exports = (function(){
  function CreateEnv()
  {
    var _config = {};

    function Env(c)
    {
      _config = c;
    }

    Env.config = function()
    {
      return _config;
    }

    return Env;
  }
  return CreateEnv;
}());
