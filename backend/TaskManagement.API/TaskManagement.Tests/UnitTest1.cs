using Microsoft.EntityFrameworkCore;
using TaskManagement.API.Data;
using TaskManagement.API.DTOs;
using TaskManagement.API.Models;
using TaskManagement.API.Services;
using Microsoft.Extensions.Configuration;

namespace TaskManagement.Tests
{
    public class AuthServiceTests
    {
        private AppDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        private IConfiguration GetConfig()
        {
            var inMemorySettings = new Dictionary<string, string>
            {
                {"Jwt:Key", "TaskManagementSuperSecretKey123456789!@#"},
                {"Jwt:Issuer", "TaskManagement.API"},
                {"Jwt:Audience", "TaskManagement.Client"}
            };
            return new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings!)
                .Build();
        }

        [Fact]
        public async Task Register_ShouldCreateUser_WhenEmailIsNew()
        {
            var context = GetInMemoryContext();
            var config = GetConfig();
            var service = new AuthService(context, config);

            var dto = new RegisterDTO
            {
                FullName = "Test User",
                Email = "test@example.com",
                Password = "Test@123"
            };

            var result = await service.Register(dto);

            Assert.NotNull(result);
            Assert.Equal("test@example.com", result.Email);
        }

        [Fact]
        public async Task Register_ShouldReturnNull_WhenEmailExists()
        {
            var context = GetInMemoryContext();
            var config = GetConfig();
            var service = new AuthService(context, config);

            var dto = new RegisterDTO
            {
                FullName = "Test User",
                Email = "test@example.com",
                Password = "Test@123"
            };

            await service.Register(dto);
            var result = await service.Register(dto);

            Assert.Null(result);
        }

        [Fact]
        public async Task Login_ShouldReturnToken_WhenCredentialsAreValid()
        {
            var context = GetInMemoryContext();
            var config = GetConfig();
            var service = new AuthService(context, config);

            await service.Register(new RegisterDTO
            {
                FullName = "Test User",
                Email = "test@example.com",
                Password = "Test@123"
            });

            var result = await service.Login(new LoginDTO
            {
                Email = "test@example.com",
                Password = "Test@123"
            });

            Assert.NotNull(result);
            Assert.NotEmpty(result.Token);
        }

        [Fact]
        public async Task Login_ShouldReturnNull_WhenPasswordIsWrong()
        {
            var context = GetInMemoryContext();
            var config = GetConfig();
            var service = new AuthService(context, config);

            await service.Register(new RegisterDTO
            {
                FullName = "Test User",
                Email = "test@example.com",
                Password = "Test@123"
            });

            var result = await service.Login(new LoginDTO
            {
                Email = "test@example.com",
                Password = "WrongPassword"
            });

            Assert.Null(result);
        }
    }

    public class TaskServiceTests
    {
        private AppDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        [Fact]
        public async Task CreateTask_ShouldReturnTask_WhenValidData()
        {
            var context = GetInMemoryContext();
            context.Users.Add(new User
            {
                Id = 1,
                FullName = "Test User",
                Email = "test@example.com",
                PasswordHash = "hash",
                Role = "User"
            });
            await context.SaveChangesAsync();

            var service = new TaskService(context);
            var dto = new CreateTaskDTO
            {
                Title = "Test Task",
                Description = "Test Description",
                Priority = "High",
                Category = "Work"
            };

            var result = await service.CreateTask(dto, 1);

            Assert.NotNull(result);
            Assert.Equal("Test Task", result.Title);
            Assert.Equal("Pending", result.Status);
        }

        [Fact]
        public async Task GetUserTasks_ShouldReturnOnlyUserTasks_WhenRoleIsUser()
        {
            var context = GetInMemoryContext();
            context.Users.Add(new User { Id = 1, FullName = "User1", Email = "u1@test.com", PasswordHash = "h", Role = "User" });
            context.Users.Add(new User { Id = 2, FullName = "User2", Email = "u2@test.com", PasswordHash = "h", Role = "User" });
            context.Tasks.Add(new TaskItem { Id = 1, Title = "Task1", UserId = 1, Description = "", Priority = "Low", Status = "Pending", Category = "" });
            context.Tasks.Add(new TaskItem { Id = 2, Title = "Task2", UserId = 2, Description = "", Priority = "Low", Status = "Pending", Category = "" });
            await context.SaveChangesAsync();

            var service = new TaskService(context);
            var result = await service.GetUserTasks(1, "User");

            Assert.Single(result);
            Assert.Equal("Task1", result[0].Title);
        }

        [Fact]
        public async Task GetUserTasks_ShouldReturnAllTasks_WhenRoleIsAdmin()
        {
            var context = GetInMemoryContext();
            context.Users.Add(new User { Id = 1, FullName = "User1", Email = "u1@test.com", PasswordHash = "h", Role = "User" });
            context.Users.Add(new User { Id = 2, FullName = "User2", Email = "u2@test.com", PasswordHash = "h", Role = "User" });
            context.Tasks.Add(new TaskItem { Id = 1, Title = "Task1", UserId = 1, Description = "", Priority = "Low", Status = "Pending", Category = "" });
            context.Tasks.Add(new TaskItem { Id = 2, Title = "Task2", UserId = 2, Description = "", Priority = "Low", Status = "Pending", Category = "" });
            await context.SaveChangesAsync();

            var service = new TaskService(context);
            var result = await service.GetUserTasks(1, "Admin");

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task DeleteTask_ShouldReturnTrue_WhenTaskExists()
        {
            var context = GetInMemoryContext();
            context.Users.Add(new User { Id = 1, FullName = "User1", Email = "u1@test.com", PasswordHash = "h", Role = "User" });
            context.Tasks.Add(new TaskItem { Id = 1, Title = "Task1", UserId = 1, Description = "", Priority = "Low", Status = "Pending", Category = "" });
            await context.SaveChangesAsync();

            var service = new TaskService(context);
            var result = await service.DeleteTask(1, 1, "User");

            Assert.True(result);
        }
    }
}