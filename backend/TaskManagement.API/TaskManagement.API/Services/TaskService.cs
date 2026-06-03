using Microsoft.EntityFrameworkCore;
using TaskManagement.API.Data;
using TaskManagement.API.DTOs;
using TaskManagement.API.Models;

namespace TaskManagement.API.Services
{
    public class TaskService
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskResponseDTO>> GetUserTasks(int userId, string role)
        {
            var query = role == "Admin"
                ? _context.Tasks.Include(t => t.User)
                : _context.Tasks.Include(t => t.User).Where(t => t.UserId == userId);

            return await query.Select(t => new TaskResponseDTO
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority,
                Status = t.Status,
                Category = t.Category,
                DueDate = t.DueDate,
                CreatedAt = t.CreatedAt,
                AssignedTo = t.User.FullName
            }).ToListAsync();
        }

        public async Task<TaskResponseDTO?> GetTaskById(int taskId, int userId, string role)
        {
            var task = await _context.Tasks.Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == taskId && (role == "Admin" || t.UserId == userId));

            if (task == null) return null;

            return new TaskResponseDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Priority = task.Priority,
                Status = task.Status,
                Category = task.Category,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                AssignedTo = task.User.FullName
            };
        }

        public async Task<TaskResponseDTO> CreateTask(CreateTaskDTO dto, int userId)
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                Category = dto.Category,
                DueDate = dto.DueDate,
                UserId = userId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);

            return new TaskResponseDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Priority = task.Priority,
                Status = task.Status,
                Category = task.Category,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt,
                AssignedTo = user?.FullName ?? ""
            };
        }

        public async Task<bool> UpdateTask(int taskId, UpdateTaskDTO dto, int userId, string role)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && (role == "Admin" || t.UserId == userId));

            if (task == null) return false;

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Priority = dto.Priority;
            task.Status = dto.Status;
            task.Category = dto.Category;
            task.DueDate = dto.DueDate;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTask(int taskId, int userId, string role)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && (role == "Admin" || t.UserId == userId));

            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}