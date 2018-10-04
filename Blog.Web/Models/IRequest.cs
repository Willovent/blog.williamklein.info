using Microsoft.AspNetCore.Http;

namespace Blog.Web.Models
{
  public class IRequest
  {
    public object cookies { get; set; }
    public object headers { get; set; }
    public object host { get; set; }
  }

  public static class IRequestExtension
  {
    public static IRequest AbstractHttpContextRequestInfo(this HttpRequest request)
    {
      var requestSimplified = new IRequest
      {
        cookies = request.Cookies,
        headers = request.Headers,
        host = request.Host
      };

      return requestSimplified;
    }
  }
}
