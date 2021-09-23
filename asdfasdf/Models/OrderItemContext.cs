using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace asdfasdf.Models
{
    public class OrderItemContext : DbContext
    {
        public OrderItemContext(DbContextOptions<OrderItemContext> options)
            : base(options)
        { }

        public DbSet<OrderItem> OrderItems { get; set; }
    }
}
