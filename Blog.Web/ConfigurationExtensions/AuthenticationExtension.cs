using Blog.Data;
using Blog.Domain.Command;
using Blog.Domain.Queries;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Blog.Web.ConfigurationExtensions
{
  public static class AuthenticationExtension
  {
    public static IServiceCollection AddBlogAuthentication(this IServiceCollection services)
    {
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

      return services;
    }
  }
}
