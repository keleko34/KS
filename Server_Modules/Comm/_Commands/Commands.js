var command_module = require('./_Command/Command');

module.exports = (function(CreateCommand){
  function CreateCommands(){

    var _list = {};

    function Commands(message){
      if(message.command !== undefined && Commands.list()[message.command]){
        Commands.list()[message.command].exec()((message.data !== undefined ? message.data : null));
      }
    }

    Commands.list = function(n,c){
      if(n === undefined){
        return _list;
      }
      if(c === undefined && n.constructor === Object){
        _list = n;
        return Commands;
      }
      n = ((typeof n === 'string' || n.toString() !== '[object Object]') ? n.toString() : 'default');
      _list[n] = (c instanceof CreateCommand() ? c : CreateCommand().title(n).exec((typeof c === 'function' ? c : function(){})));
      return Commands;
    }

    return Commands;
  }
  return CreateCommands;
}(command_module))
