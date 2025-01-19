namespace CatalogoDireccionesApp.Data
{
    using Microsoft.EntityFrameworkCore;
    using CatalogoDireccionesApp.Models;

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {
        }
        public DbSet<Address> Address { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Address>().ToTable("Address" , schema:"SalesLT");
        }

    }
}
