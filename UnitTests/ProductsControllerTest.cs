using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http.Results;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using asdfasdf.Controllers;
using asdfasdf.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NotFoundResult = Microsoft.AspNetCore.Mvc.NotFoundResult;
using StatusCodeResult = Microsoft.AspNetCore.Mvc.StatusCodeResult;

namespace asdfasdf.Tests
{
    // Reference: https://www.youtube.com/watch?v=dsD0CMgPjUk
    [TestClass]
    public class ProductsControllerTest
    {
        private readonly ProductContext _mockContext;

        public ProductsControllerTest(ProductContext context)
        {
            _mockContext = context;
        }

        [TestMethod]
        public async Task GetProduct_WithNonExistingItem_ReturnsNotFound()
        {
            // Arrange - provide any value to function and return null
            var _contextMock = new Mock<ProductContext>();
            _contextMock.Setup(context => context.Products.FindAsync(It.IsAny<Guid>()))
                .ReturnsAsync((Product)null);

            var controller = new ProductsController(_contextMock.Object);
            // Act
            var result = await controller.GetProduct("1234");

            // Assert
            Assert.IsInstanceOfType(result.Result, NotFoundResult, "object is not of correct type");
        }

    }
}



    





