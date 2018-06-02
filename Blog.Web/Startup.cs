using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Swagger;
using Blog.Data;
using Blog.Domain;
using Blog.Domain.Queries;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Blog.Domain.Command;
using Blog.Web.Sitemap;

namespace Blog.Web
{
  public class Startup
  {
    public Startup(IHostingEnvironment env)
    {
      var builder = new ConfigurationBuilder()
          .SetBasePath(env.ContentRootPath)
          .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
          .AddEnvironmentVariables();

      if (env.IsDevelopment())
      {
        builder.AddUserSecrets<Startup>();
      }

      configuration = builder.Build();
    }

    private IConfigurationRoot configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
      services.AddAuthorization();
      services.AddEntityFrameworkSqlServer()
            .AddDbContext<BlogContext>(options => options.UseSqlServer(configuration["Data:BlogConnection:ConnectionString"]));
      services.AddScoped<IBlogContext>(provider => provider.GetService<BlogContext>());
      services.AddScoped<QueryCommandBuilder>();
      services.AddScoped<GetCategoriesWithPostsNumberQuery>();
      services.AddScoped<GetDraftQuery>();
      services.AddScoped<GetPostQuery>();
      services.AddScoped<GetPostsQuery>();
      services.AddScoped<AddPostCommand>();
      services.AddScoped<EditPostCommand>();
      services.AddScoped<GetCategoriesQuery>();
      services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
      services.AddMvc();
      services.AddNodeServices();
      services.AddMemoryCache();
      services.AddCors(x => x.AddPolicy("dev", y => y.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().AllowCredentials()));
      services.AddScoped<SitemapBuilder>();
      services.AddAuthentication(options =>
      {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
      .AddJwtBearer(options =>
      {
        options.Audience = "Ygg0pdZ-QB74OA-fFj4QVn4OtxhzChfS";
        options.Authority = $"https://ovent.eu.auth0.com/";
      });

      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new Info { Title = "Le gg blog", Version = "v1" });
      });
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
      loggerFactory.AddConsole(configuration.GetSection("Logging"));
      loggerFactory.AddDebug();

      app.UseStaticFiles();
      app.UseAuthentication();

      if (env.IsDevelopment())
      {
        app.UseCors("dev");
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
          c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        });

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
      else
      {
        app.UseMvc(routes =>
        {
          routes.MapSpaFallbackRoute(
            name: "spa-fallback",
            defaults: new { controller = "Home", action = "Index" });
        });
        app.UseExceptionHandler("/Home/Error");
      }
    }
  }
}
