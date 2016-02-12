var command_module = require('./_Command/Command');

Module.exports = (function(CreateCommand){
  function CreateCommands(){

    var _dictionary = {};

    function Commands(message){
      if(message.command !== undefined){
        Commands.dictionary()[message.command]((message.data !== undefined ? message.data : null));
      }
    }

    Commands.dictionary = function(n,c){
      if(n === undefined){
        return _dictionary;
      }
      if(c === undefined && n.constructor === Object){
        _dictionary = n;
        return Commands;
      }
      n = ((typeof n === 'string' || n.toString() !== '[object Object]') ? n.toString() : 'default');
      _dictionary[n] = (c instanceof CreateCommand() ? c : CreateCommand().title(n).exec((typeof c === 'function' ? c : function(){})));
      return Commands;
    }

    return Commands;
  }
  return CreateCommands;
}(command_module))
