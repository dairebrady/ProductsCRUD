using System;
namespace asdfasdf.Models
{
    public class OrderItem
    {
        public int OrderItemID { get; set; }
        public int OrderID { get; set; }
        public string ProductID { get; set; }
        public int Quantity { get; set; }
    }
}
