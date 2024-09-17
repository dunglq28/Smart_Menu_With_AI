using Amazon.S3;
using Amazon;
using Microsoft.OpenApi.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using FSU.SmartMenuWithAI.API.Middlewares;
using System.Text;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.Services;
using FSU.SmartMenuWithAI.Service.ISerivice;
using Microsoft.EntityFrameworkCore;
using FSU.SmartMenuWithAI.Repository.Interfaces;
using FSU.SmartMenuWithAI.Repository.Repositories;
using FSU.SmartMenuWithAI.API.Payloads.Responses;
using FSU.SmartMenuWithAI.Service.Mappings;
using FSU.SmartMenuWithAI.Repository.Entities;
using System.Text.Json.Serialization;
using SharpDX;
using FSU.SmartMenuWithAI.Service.Models.PayOS;
using FSU.SmartMenuWithAI.Service.Models.Email;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<SmartMenuContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));

});
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = new KebabCaseNamingPolicy();
    options.JsonSerializerOptions.DictionaryKeyPolicy = new KebabCaseNamingPolicy();
});
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "SmartMenu API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    }); option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});
//Config AWSS3
builder.Services.AddSingleton<IAmazonS3, AmazonS3Client>();
builder.Services.AddScoped<IS3Service, S3Service>();
AWSConfigs.AWSRegion = "ap-southeast-1";

//Config PayOS
builder.Services.Configure<PayOSSetting>(builder.Configuration.GetSection("PayOS"));
builder.Services.AddScoped<IPayOSService, PayOSService>();

// Add Mapping profiles
var mapper = new MapperConfiguration(mc =>
{
    mc.AddProfile<MappingProfile>();
});

// Config send email
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("Smtp"));
builder.Services.AddSingleton<IEmailService, EmailService>();

builder.Services.AddSingleton(mapper.CreateMapper());

// Register repositories
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IAppUserRepository, AppUserRepository>();
builder.Services.AddScoped<IBrandRepository, BrandRepository>();
builder.Services.AddScoped<IMenuListRepository, MenuListRepository>();
builder.Services.AddScoped<IGroupAttributeRepository, GroupAttributeRepository>();
builder.Services.AddScoped<IAttributeRepository, AttributeRepository>();
builder.Services.AddScoped<IListPositionRepository, ListPositionRepository>();
builder.Services.AddScoped<IProductListRepository, ProductListRepository>();
builder.Services.AddScoped<ICustomerSegmentRepository, CustomerSegmentRepository>();
builder.Services.AddScoped<IMenuSegmentRepository, MenuSegmentRepository>();
builder.Services.AddScoped<IMenuRepository, MenuRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPlanRepository, PlanRepository>();
builder.Services.AddScoped<ISubscriptionRepository, SubscriptioRepository>();



// Register servicies
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IAppUserService, AppUserService>();
builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IStoreService, StoreService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IMenuListService, MenuListService>();
builder.Services.AddScoped<ICustomerSegmentService, CustomerSegmentService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();
builder.Services.AddScoped<IGroupAttributeService, GroupAttributeService>();
builder.Services.AddScoped<IAttributeService, AttributeService>();
builder.Services.AddScoped<IListPositionService, ListPositionService>();
builder.Services.AddScoped<IProductListService, ProductListService>();
builder.Services.AddScoped<ISegmentAttributeService, SegmentAttributeService>();
builder.Services.AddScoped<IMenuSegmentService, MenuSegmentService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IPlanService, PlanService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();



//Config Jwt Token
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"])),
        ClockSkew = TimeSpan.Zero
    };
});

// Add CORS
builder.Services.AddCors(p => p.AddPolicy("Cors", policy =>
{
    policy.WithOrigins("*")
          .AllowAnyHeader()
          .AllowAnyMethod();
}));
// add  json option để tránh vòng lặp tại json khi trả về
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

var app = builder.Build();

app.UseCors("Cors");

// Config Middleware
app.UseMiddleware<AccountStatusMiddleware>();
app.UseMiddleware<TokenValidationMiddleware>();
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();