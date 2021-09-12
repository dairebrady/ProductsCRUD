using System;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace AdvancedProgrammingProject.Models
{
    public class ProductContext : DbContext
    {
        public ProductContext(DbContextOptions<ProductContext> options)
            : base(options)
        { }

        public DbSet<Product> Products { get; set; }
    }
}
