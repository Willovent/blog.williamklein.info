using Blog.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Blog.Web.ConfigurationExtensions
{
  public static class DataExtension
  {
    public static IServiceCollection AddBlogData(this IServiceCollection services, IConfiguration configuration)
    {
      services.AddEntityFrameworkSqlServer()
             .AddDbContext<BlogContext>(options => options.UseSqlServer(configuration["Data:BlogConnection:ConnectionString"]));
      services.AddScoped<IBlogContext>(provider => provider.GetService<BlogContext>());

      return services;
    }
  }
}
