using Blog.Data;
using Blog.Domain.Command;
using Blog.Domain.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Threading.Tasks;

namespace Blog.Web.Controllers
{
  [Route("api/backoffice")]
  [Authorize(Roles = "Blogger")]
  public class BackOfficeController : Controller
  {

    [HttpPost]
    [Route("flush-cache")]
    public IActionResult FlushCache([FromBody] string key, [FromServices] IMemoryCache cache)
    {
      cache.Remove(key);
      return Ok();
    }

    [HttpPost]
    [Route("")]
    public async Task<IActionResult> AddPost([FromBody]Post post, [FromServices] IMemoryCache cache, [FromServices] AddPostCommand command)
    {
      cache.Remove("/");
      await command.ExecuteAsync(post);
      return Ok();
    }

    [HttpPost]
    [Route("{postUrl}")]
    public async Task<IActionResult> EditPost([FromBody]Post post, [FromServices] EditPostCommand command)
    {
      await command.ExecuteAsync(post);
      return Ok();
    }

    [Route("{categoryCode}/{postUrl}", Order = 3)]
    [HttpGet]
    public async Task<IActionResult> Post([FromServices] GetPostQuery query, string categoryCode, string postUrl)
    {
      Post post = await query.WithUnpublish().WithoutContent().ExecuteAsync(categoryCode, postUrl);
      if (post == null)
      {
        return new NotFoundResult();
      }

      return Json(post);
    }

    [Route("category/{categoryCode}")]
    [Route("posts")]
    [HttpGet]
    public async Task<IActionResult> AllPosts([FromServices] GetPostsQuery query, string categoryCode = null)
    {
      System.Collections.Generic.List<Post> posts = await query.ForCategory(categoryCode).WithUnpublish().Build().ToListAsync();
      return Json(posts);
    }
  }
}
