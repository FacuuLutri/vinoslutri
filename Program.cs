using Distribuidora.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor.
builder.Services.AddControllers();
builder.Services.AddDbContext<DistribuidoraContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Configurar la tubería de solicitudes HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Habilitar el uso de archivos estáticos
app.UseHttpsRedirection();
app.UseStaticFiles(); // Asegúrate de que esto esté presente

app.UseAuthorization();
app.MapControllers(); // Mapea los controladores

app.Run();