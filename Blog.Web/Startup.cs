using Blog.Web.ConfigurationExtensions;
using Blog.Web.Sitemap;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace Blog.Web
{
  public class Startup
  {
    private IConfigurationRoot configuration { get; }

    public Startup(IHostingEnvironment env)
    {
      IConfigurationBuilder builder = new ConfigurationBuilder()
          .SetBasePath(env.ContentRootPath)
          .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
          .AddEnvironmentVariables();

      if (env.IsDevelopment())
      {
        builder.AddUserSecrets<Startup>();
      }

      this.configuration = builder.Build();
    }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddAuthorization()
              .AddBlogData(this.configuration)
              .AddBlogSwagger()
              .AddBlogDomain()
              .AddBlogAuthentication()
              .AddMemoryCache()
              .AddCors(x => x.AddPolicy("dev", y => y.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials()))
              .AddScoped<SitemapBuilder>();

      services.AddNodeServices();
      services.AddSpaPrerenderer();
      services.AddMvc();
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
      loggerFactory.AddConsole(this.configuration.GetSection("Logging"));
      loggerFactory.AddDebug();

      app.UseStaticFiles();
      app.UseAuthentication();

      if (env.IsProduction())
      {
        app.UseMvc(routes =>
        {
          routes.MapSpaFallbackRoute(
            name: "spa-fallback",
            defaults: new { controller = "Home", action = "Index" });
        });

        app.UseExceptionHandler("/Home/Error");
      }
      else
      {
        app.UseCors("dev");
        app.UseDeveloperExceptionPage();
        app.UseBlogSwagger();

        app.MapWhen(x => !x.Request.Path.Value.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase), builder =>
        {
          builder.UseMvc(routes =>
          {
            routes.MapSpaFallbackRoute(
                name: "spa-fallback",
                defaults: new { controller = "Home", action = "Index" });
          });
        });
      }
    }
  }
}
