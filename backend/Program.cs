using backend.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.OpenApi;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000") 
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddProblemDetails();

builder.Services.AddScoped<ActivityService>();
builder.Services.AddScoped<UserContext>();
builder.Services.AddScoped<GoalService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie()
.AddOpenIdConnect(options =>
{
    options.Authority = builder.Configuration["Authentik:Authority"];
    options.ClientId = builder.Configuration["Authentik:ClientId"];
    options.ClientSecret = builder.Configuration["Authentik:ClientSecret"];
    options.ResponseType = "code";
    options.SaveTokens = true;
    options.GetClaimsFromUserInfoEndpoint = true;
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        NameClaimType = "name",
        RoleClaimType = "groups"
    };

    options.Events.OnAuthenticationFailed = context =>
    {
        //Console.WriteLine(context.Exception.Message);
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToIdentityProvider = context =>
    {
        // do not redirect if the request comes from login endpoint
        if (context.Request.Path.StartsWithSegments("/api") &&
            !context.Request.Path.StartsWithSegments("/api/security/login"))
        {
            context.HandleResponse();
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        }
        return Task.CompletedTask;
    };
});

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    options.OperationFilter<ProblemDetailsOperationFilter>();
});


var app = builder.Build();

app.UseCors("FrontendPolicy");
app.UseHttpsRedirection();

app.UseExceptionHandler();
app.UseStatusCodePages();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment())
    app.UseSwagger();


app.Run();