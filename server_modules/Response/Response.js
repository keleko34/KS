module.exports = (function(){
  function CreateResponse()
  {
    var _content = ''
      , _headers = {}

    function Response(res)
    {
      Object.keys(Response.headers())
      .forEach(function(h,i){
        res.setHeader(h,Response.headers()[h]);
      });
      res.write(Response.content());
      res.end();
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

    return Response;
  }
  return CreateResponse;
}());
