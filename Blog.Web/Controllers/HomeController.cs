using Blog.Domain.Queries;
using Blog.Web.Models;
using Blog.Web.Sitemap;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Web.Controllers
{
  public class HomeController : Controller
  {
    [HttpGet]
    public async Task<IActionResult> Index([FromServices] ISpaPrerenderer prerenderer, [FromServices] IMemoryCache cache)
    {
      IHttpRequestFeature requestFeature = this.Request.HttpContext.Features.Get<IHttpRequestFeature>();
      string unencodedPathAndQuery = requestFeature.RawTarget;

      RenderToStringResult prerenderResult = await cache.GetOrCreateAsync(unencodedPathAndQuery, entry =>
      {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(10);
        entry.SlidingExpiration = TimeSpan.FromDays(3);
        return prerenderer.RenderToString("angular/dist-server/server", customDataParameter: new { request = this.Request.AbstractHttpContextRequestInfo() });
      });

      this.ViewData["SpaHtml"] = prerenderResult.Html;
      this.ViewData["Title"] = prerenderResult.Globals["title"];
      this.ViewData["Scripts"] = prerenderResult.Globals["scripts"];
      this.ViewData["Styles"] = prerenderResult.Globals["styles"];
      this.ViewData["Meta"] = prerenderResult.Globals["meta"];
      this.ViewData["Links"] = prerenderResult.Globals["links"];
      this.ViewData["TransferData"] = prerenderResult.Globals["transferData"];

      return View();
    }

    [ResponseCache(Duration = 86400, Location = ResponseCacheLocation.Any)]
    [HttpGet]
    [Route("robots.txt")]
    public ContentResult RobotsText()
    {
      var stringBuilder = new StringBuilder();

      stringBuilder.AppendLine("user-agent: *");
      stringBuilder.AppendLine("allow: /");
      stringBuilder.Append("sitemap: ");
      stringBuilder.AppendLine($"{this.Request.Scheme}://{this.Request.Host}/sitemap.xml");

      return Content(stringBuilder.ToString(), "text/plain", Encoding.UTF8);
    }

    [HttpGet]
    [Route("sitemap.xml")]
    public async Task<IActionResult> SitemapXml([FromServices]SitemapBuilder sitemapBuilder, [FromServices] GetPostsQuery getPostsQuery)
    {
      DateTime now = DateTime.Now;

      sitemapBuilder.AddUrl(new SitemapNode
      {
        Url = $"{this.Request.Scheme}://{this.Request.Host}",
        ChangeFrequency = ChangeFrequency.Always,
        Modified = now,
        Priority = 1
      });

      var posts = await getPostsQuery.Build().Select(p => new { PostUrl = p.Url, CategoryCode = p.Category.Code, p.PublicationDate }).ToListAsync();
      foreach (var post in posts)
      {
        sitemapBuilder.AddUrl(new SitemapNode
        {
          Url = $"{this.Request.Scheme}://{this.Request.Host}/posts/{post.CategoryCode}/{post.PostUrl}",
          Priority = 0.5,
          Modified = post.PublicationDate,
          ChangeFrequency = ChangeFrequency.Always
        });
      }

      return Content(sitemapBuilder.ToString(), "application/xml", Encoding.UTF8);
    }

    public IActionResult Error() => View();
  }
}
