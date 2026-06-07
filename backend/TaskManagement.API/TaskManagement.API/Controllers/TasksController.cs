using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagement.API.DTOs;
using TaskManagement.API.Services;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        private string GetUserRole() =>
            User.FindFirst(ClaimTypes.Role)!.Value;

        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var tasks = await _taskService.GetUserTasks(GetUserId(), GetUserRole());
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var task = await _taskService.GetTaskById(id, GetUserId(), GetUserRole());
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask(CreateTaskDTO dto)
        {
            var task = await _taskService.CreateTask(dto, GetUserId());
            return Ok(task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, UpdateTaskDTO dto)
        {
            var result = await _taskService.UpdateTask(id, dto, GetUserId(), GetUserRole());
            if (!result) return NotFound();
            return Ok("Task updated!");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var result = await _taskService.DeleteTask(id, GetUserId(), GetUserRole());
            if (!result) return NotFound();
            return Ok("Task deleted!");
        }
        [HttpPost("assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignTask(CreateTaskDTO dto, [FromQuery] int userId)
        {
            var task = await _taskService.CreateTask(dto, userId);
            return Ok(task);
        }

    }
}
