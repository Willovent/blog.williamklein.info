using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.Http.Features;
using Blog.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using Microsoft.AspNetCore.Hosting;
using System.Threading;
using Microsoft.Extensions.Caching.Memory;
using System.Text;
using Blog.Web.Sitemap;
using Blog.Domain;
using Blog.Domain.Queries;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Blog.Web.Controllers
{
  public class HomeController : Controller
  {
    [HttpGet]
    public async Task<IActionResult> Index(
      [FromServices]INodeServices nodeServices,
      [FromServices] IHostingEnvironment hostEnv,
      [FromServices] IMemoryCache cache,
      CancellationToken token)
    {
      var requestFeature = Request.HttpContext.Features.Get<IHttpRequestFeature>();
      var unencodedPathAndQuery = requestFeature.RawTarget;

      var prerenderResult = await cache.GetOrCreateAsync(unencodedPathAndQuery, entry =>
      {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(10);
        entry.SlidingExpiration = TimeSpan.FromDays(3);
        var unencodedAbsoluteUrl = $"{Request.Scheme}://{Request.Host}{unencodedPathAndQuery}";
        var applicationBasePath = hostEnv.ContentRootPath;

        TransferData transferData = new TransferData();
        transferData.request = AbstractHttpContextRequestInfo(Request); // You can automatically grab things from the REQUEST object in Angular because of this
        return Prerenderer.RenderToString(
            "/", // baseURL
            nodeServices,
            token,
            new JavaScriptModuleExport(applicationBasePath + "/angular/dist-server/server"),
            unencodedAbsoluteUrl,
            unencodedPathAndQuery,
            transferData,
            30000, // timeout duration
            Request.PathBase.ToString()
        );
      });



      ViewData["SpaHtml"] = prerenderResult.Html;
      ViewData["Title"] = prerenderResult.Globals["title"];
      ViewData["Scripts"] = prerenderResult.Globals["scripts"];
      ViewData["Styles"] = prerenderResult.Globals["styles"];
      ViewData["Meta"] = prerenderResult.Globals["meta"];
      ViewData["Links"] = prerenderResult.Globals["links"];
      ViewData["TransferData"] = prerenderResult.Globals["transferData"]; // our transfer data set to window.TRANSFER_CACHE = {};


      return View();
    }

    [ResponseCache(Duration = 86400, Location = ResponseCacheLocation.Any)]
    [Route("robots.txt")]
    public ContentResult RobotsText()
    {
      var stringBuilder = new StringBuilder();

      stringBuilder.AppendLine("user-agent: *");
      stringBuilder.AppendLine("allow: /");
      stringBuilder.Append("sitemap: ");
      stringBuilder.AppendLine( $"{Request.Scheme}://{Request.Host}/sitemap.xml");

      return Content(stringBuilder.ToString(), "text/plain", Encoding.UTF8);
    }

    [Route("sitemap.xml")]
    public async Task<IActionResult> SitemapXml([FromServices]SitemapBuilder sitemapBuilder, [FromServices] QueryCommandBuilder queryCommandBuilder)
    {
      var now = DateTime.Now;

      // Fixed pages -> Home & Home blog
      sitemapBuilder.AddUrl(new SitemapNode
      {
        Url = $"{Request.Scheme}://{Request.Host}",
        ChangeFrequency = ChangeFrequency.Always,
        Modified = now,
        Priority = 1
      });

      // Posts pages
      var posts = await queryCommandBuilder.Build<GetPostsQuery>().Build().Select(p => new { PostUrl = p.Url, CategoryCode = p.Category.Code, PublicationDate = p.PublicationDate }).ToListAsync();
      foreach (var post in posts)
      {
        sitemapBuilder.AddUrl(new SitemapNode
        {
          Url = $"{Request.Scheme}://{Request.Host}/posts/{post.CategoryCode}/{post.PostUrl}",
          Priority = 0.5,
          Modified = post.PublicationDate,
          ChangeFrequency = ChangeFrequency.Always
        });
      }

      return Content(sitemapBuilder.ToString(), "application/xml", Encoding.UTF8);
    }

    public IActionResult Error()
    {
      return View();
    }
    private IRequest AbstractHttpContextRequestInfo(HttpRequest request)
    {

      IRequest requestSimplified = new IRequest();
      requestSimplified.cookies = request.Cookies;
      requestSimplified.headers = request.Headers;
      requestSimplified.host = request.Host;

      return requestSimplified;
    }
  }
}
