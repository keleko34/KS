var fs_module = require('fs');

module.exports = (function(fs){
  function CreateError()
  {
    var _type = 0
      , _typeEnum = [404,500,1000] //need to add more
      , _template = 'default'

    function Error()
    {
      if(Error.type() >= 1000)
      {
        this.base('/admin');
      }
      this.base((this.base() !== '/admin' ? '/templates/error' : this.base()+'/errors'));
      this.url(this.base().indexOf('/admin') < 0 ? '/'+Error.type()+'/'+Error.template()+'.html' : '/'+Error.type()+'.html');
      this.location((this.base() !== '/admin' ? (process.cwd().replace(/\\/g,"/")) : this.location()));
      console.log(this.base(),this.location(),this.url());
      return fs.createReadStream(this.location()+this.base()+this.url());
    }

    Error.template = function(t)
    {
      if(t === undefined)
      {
        return _template;
      }
      _template = (typeof t === 'string' ? t : _template);
      return Error;
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
