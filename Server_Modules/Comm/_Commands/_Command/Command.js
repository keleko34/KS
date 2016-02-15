module.exports = (function(){
  function CreateCommand(){

    /* the title of the command to run */
    var _title = ''

    /* the command to execute */
      , _exec = function(){}

    function Command(message){
      Command.exec(message);
    }

    Command.title = function(t){
      if(t === undefined){
        return _title;
      }
      _title = ((typeof t === 'stirng' || t.toString() !== '[object Object]') ? t.toString() : _title);
      return Command;
    }

    Command.exec = function(e){
      if(e === undefined){
        return _exec;
      }
      _exec = (typeof e === 'function' ? e : _exec);
      return Command;
    }

    return Command;
  }
  return CreateCommand;
}());
