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
        var unencodedAbsoluteUrl = $"{Request.Scheme}://{Request.Host}{unencodedPathAndQuery}";
        var applicationBasePath = hostEnv.ContentRootPath;

        TransferData transferData = new TransferData();
        transferData.request = AbstractHttpContextRequestInfo(Request); // You can automatically grab things from the REQUEST object in Angular because of this
        return Prerenderer.RenderToString(
            "/", // baseURL
            nodeServices,
            token,
            new JavaScriptModuleExport(applicationBasePath + "/angular/server"),
            unencodedAbsoluteUrl,
            unencodedPathAndQuery,
            transferData,
            30000, // timeout duration
            Request.PathBase.ToString()
        );
      });
      


      ViewData["SpaHtml"] = prerenderResult.Html;
      ViewData["Title"] = prerenderResult.Globals["title"];
      ViewData["Styles"] = prerenderResult.Globals["styles"];
      ViewData["Meta"] = prerenderResult.Globals["meta"];
      ViewData["Links"] = prerenderResult.Globals["links"];
      ViewData["TransferData"] = prerenderResult.Globals["transferData"]; // our transfer data set to window.TRANSFER_CACHE = {};


      return View();
    }

    [HttpGet]
    [Route("sitemap.xml")]
    public async Task<IActionResult> SitemapXml()
    {
      String xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

      xml += "<sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">";
      xml += "<sitemap>";
      xml += "<loc>http://localhost:4251/home</loc>";
      xml += "<lastmod>" + DateTime.Now.ToString("yyyy-MM-dd") + "</lastmod>";
      xml += "</sitemap>";
      xml += "</sitemapindex>";

      return Content(xml, "text/xml");

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
