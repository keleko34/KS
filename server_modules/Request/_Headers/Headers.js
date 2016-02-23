module.exports = (function(){
  function CreateHeader()
  {
    var _status = 200;

    function Header(req)
    {
      var _header = {};
      _header.status = Header.status();
      return _header;
    }

    Header.status = function(s)
    {
      if(s === undefined)
      {
        return _status;
      }
      _status = (typeof s === 'number' || !isNaN(parseInt(s,10)) ? parseInt(s,10) : _status);
      return Header;
    }

    return Header;
  }
  return CreateHeader;
}());
