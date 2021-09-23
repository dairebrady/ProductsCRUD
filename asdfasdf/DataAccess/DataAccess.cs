using System;
using System.Linq;
using Microsoft.Data.SqlClient;
using asdfasdf.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace asdfasdf.DataAccess
{
    public class DataAccess
    {

        public static async Task<List<OrderItem>> SearchOrders(int orderId, OrderItemContext context )
        {
            List<OrderItem> searchedList = await (
                    from orderItem in context.OrderItems
                    where orderItem.OrderID == orderId
                    select orderItem
                ).ToListAsync();

            return searchedList;
        }
        
    }
}
