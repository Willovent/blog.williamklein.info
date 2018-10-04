using Blog.Data;
using Blog.Domain.Command;
using Blog.Domain.Queries;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Blog.Web.ConfigurationExtensions
{
  public static class DomainExtension
  {
    public static IServiceCollection AddBlogDomain(this IServiceCollection services)
    {
      services.AddScoped<GetCategoriesWithPostsNumberQuery>();
      services.AddScoped<GetDraftQuery>();
      services.AddScoped<GetPostQuery>();
      services.AddScoped<GetPostsQuery>();
      services.AddScoped<AddPostCommand>();
      services.AddScoped<EditPostCommand>();
      services.AddScoped<GetCategoriesQuery>();
  
      return services;
    }
  }
}
