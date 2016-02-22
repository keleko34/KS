module.exports = (function(){
  function CreateResponse()
  {
    var _content = ''
      , _headers = {}
      , _type = 'content'
      , _typeEnum = ['stream','content'];

    function Response(res)
    {
      Object.keys(Response.headers())
      .forEach(function(h,i){
        res.setHeader(h,Response.headers()[h]);
      });
      if(Response.type() === 'stream')
      {
        res.pipe(Response.content());
      }
      else
      {
        res.write(Response.content());
        res.end();
      }
    }

    Response.content = function(c)
    {
      if(c === undefined)
      {
        return _content;
      }
      _content = c;
      return Response;
    }

    Response.headers = function(h)
    {
      if(h === undefined)
      {
        return _headers;
      }
      _headers = (h.constructor === Object ? h : _headers);
      return Response;
    }

    Response.type = function(t)
    {
      if(t === undefined)
      {
        return _type;
      }
      _type = (_typeEnum.indexOf(t) > -1 ? t : _type);
      return Response;
    }

    return Response;
  }
  return CreateResponse;
}());
