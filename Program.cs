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

// Configurar la tuber�a de solicitudes HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Habilitar el uso de archivos est�ticos
app.UseHttpsRedirection();
app.UseStaticFiles(); // Aseg�rate de que esto est� presente

app.UseAuthorization();
app.MapControllers(); // Mapea los controladores

app.Run();