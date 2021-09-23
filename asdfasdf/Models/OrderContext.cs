using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace asdfasdf.Models
{
    public class OrderContext : DbContext
    {
        public OrderContext(DbContextOptions<OrderContext> options)
            : base(options)
        { }

        public DbSet<Order> Orders { get; set; }
    }
}
