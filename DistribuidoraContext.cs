using Distribuidora.API.Models;
using Microsoft.EntityFrameworkCore;
namespace Distribuidora.API.Data
{
    public class DistribuidoraContext : DbContext
    {
        public DistribuidoraContext(DbContextOptions<DistribuidoraContext> options) : base(options)
        {
        }

        public DbSet<Producto> Productos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Carrito> Carritos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Oferta> Ofertas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Producto>()
                .Property(p => p.Precio)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Oferta>()
                .Property(o => o.Descuento)
                .HasColumnType("decimal(18,2)");

            base.OnModelCreating(modelBuilder);
        }
    }
}