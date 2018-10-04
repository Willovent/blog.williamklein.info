using Blog.Data;
using Blog.Domain.Filters;
using Blog.Domain.Queries;
using Blog.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Blog.Web.Controllers
{
  [Route("api/blog")]
  public class BlogController : Controller
  {
    private const int postsPerPage = 10;

    [Route("category/{categoryCode}")]
    [Route("")]
    [HttpGet]
    public async Task<IActionResult> List([FromServices] GetPostsQuery getPostQuery, string categoryCode = null, int page = 1)
    {
      if (page < 1)
      {
        page = 1;
      }

      IQueryable<Post> query = getPostQuery.ForCategory(categoryCode).Build();
      double pagesCount = Math.Ceiling((double)query.Count() / postsPerPage);

      List<Data.Post> posts = await query.Paginate((page - 1) * postsPerPage, postsPerPage).ToListAsync();

      var model = new PostsListModel
      {
        Posts = posts,
        CurrentPageIndex = page,
        TotalPageNumber = pagesCount
      };

      return Json(model);
    }

    [Route("{categoryCode}/{postUrl}", Order = 3)]
    [HttpGet]
    public async Task<IActionResult> Post([FromServices] GetPostQuery getPostQuery, string categoryCode, string postUrl)
    {
      Data.Post post = await getPostQuery.WithUnpublish().WithoutMarkDown().ExecuteAsync(categoryCode, postUrl);
      if (post == null)
      {
        return new NotFoundResult();
      }

      return Json(post);
    }

    [HttpGet]
    [Route("categories")]
    public async Task<IActionResult> GetCategories([FromServices] GetCategoriesQuery getCategoriesQuery)
    {
      List<Category> categories = await getCategoriesQuery.Build().ToListAsync();
      return Json(categories);
    }

    [Route("draft/{id}/{postUrl}")]
    [HttpGet]
    public async Task<IActionResult> Post([FromServices] GetDraftQuery getDraftQuery, int id, string postUrl)
    {
      Post post = await getDraftQuery.ExecuteAsync(id, postUrl);

      if (post == null)
      {
        return new NotFoundResult();
      }

      post.PublicationDate = new DateTime();

      return Json(post);
    }
  }
}
