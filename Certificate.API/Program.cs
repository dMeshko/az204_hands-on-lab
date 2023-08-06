using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Identity.Web;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

var executingAssembly = Assembly.GetExecutingAssembly();
var executingAssemblyName = executingAssembly.GetName().Name;

// Add services to the container.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x =>
{
    var xmlCommentsFile = $"{executingAssemblyName}.xml";
    x.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlCommentsFile));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseCors(x => x.WithOrigins("http://localhost:4200")
        .AllowAnyMethod()
        .AllowAnyHeader());
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers()
    .RequireAuthorization();

app.Run();