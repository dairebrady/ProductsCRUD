using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace asdfasdf.Models
{
    public class ProductContext : DbContext
    {
        public ProductContext(DbContextOptions<ProductContext> options)
            : base(options)
        { }

        public DbSet<Product> Products { get; set; }
    }
}
