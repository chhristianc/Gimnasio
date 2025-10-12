using Application.Interfaces;
using Application.UseCases;
using Infrastructure.Commands;
using Infrastructure.Persistence;
using Infrastructure.Queries;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseSqlServer(connectionString));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddScoped<IMiembroService, MiembroService>();
builder.Services.AddScoped<IMiembroQuery, MiembroQuery>();
builder.Services.AddScoped<IMiembroCommand, MiembroCommand>();
builder.Services.AddScoped<ITipoMembresiaService, TipoMembresiaService>();
builder.Services.AddScoped<ITipoMembresiaQuery, TipoMembresiaQuery>();
builder.Services.AddScoped<IDescuentoService, DescuentoService>();
builder.Services.AddScoped<IDescuentoQuery, DescuentoQuery>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
