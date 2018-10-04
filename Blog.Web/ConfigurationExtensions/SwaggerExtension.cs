using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;

namespace Blog.Web.ConfigurationExtensions
{
  public static class SwaggerExtension
  {
    public static IServiceCollection AddBlogSwagger(this IServiceCollection services)
    {
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new Info { Title = "Le gg blog", Version = "v1" });
      });

      return services;
    }

    public static IApplicationBuilder UseBlogSwagger(this IApplicationBuilder app)
    {
      app.UseSwagger();
      app.UseSwaggerUI(c =>
      {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
      });

      return app;
    }
  }
}
