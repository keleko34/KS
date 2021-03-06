var fs_module = require('fs');

module.exports = (function(fs){
  function CreateError()
  {
    var _type = 0
      , _typeEnum = [404,500,1000] //need to add more

    function Error()
    {
      if(Error.type() >= 1000)
      {
        this.base('/admin');
      }
      this.base((this.base() !== '/admin' ? '/errors' : this.base()+'/errors'));
      this.url('/'+Error.type()+'.html');
      return fs.createReadStream(this.location()+this.base()+this.url());
    }

    Error.type = function(t)
    {
      if(t === undefined)
      {
        return _type;
      }
      _type = (_typeEnum.indexOf(t) > -1 ? t : _type);
      return Error;
    }

    return Error;
  }
  return CreateError;
}(fs_module));
