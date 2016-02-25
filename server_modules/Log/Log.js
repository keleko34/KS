var request_log_module = require('./_Request/Request')
  , error_log_module = require('./_Error/Error')

module.exports = (function(){
  function CreateLog()
  {
    function Log()
    {

    }

    return Log;
  }
  return CreateLog;
}(request_log_module,error_log_module));
