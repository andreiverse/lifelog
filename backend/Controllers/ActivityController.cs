using backend.Models.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/activities")]
    public class ActivityController(ActivityService activityService, UserContext userContext) : ControllerBase
    {

        private readonly ActivityService _activityService = activityService;
        private readonly UserContext _userContext = userContext;

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Activity>> NewActivity([FromBody] CreateActivityRequest createActivityRequest)
        {
            createActivityRequest.UserId = _userContext.GetUserSecurityInfo().Id;

            return await _activityService.NewActivity(createActivityRequest);
        }

        [HttpPost("logs")]
        [Authorize]
        public async Task<ActionResult<ActivityLog>> NewActivityLog([FromBody] CreateActivityLogRequest createActivityLogRequest)
        {
            createActivityLogRequest.UserId = _userContext.GetUserSecurityInfo().Id;

            return await _activityService.NewActivityLog(createActivityLogRequest);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<Activity>>> GetActivities(
            [FromQuery] string? userId = null, [FromQuery] Guid? goalId = null)
        {
            userId = _userContext.GetUserSecurityInfo().Id;

            return await _activityService.GetActivities(
                UserId: userId,
                GoalId: goalId
            );
        }

        [HttpGet("logs")]
        [Authorize]
        public async Task<ActionResult<List<ActivityLog>>> GetActivityLogs(
            [FromQuery] string? userId = null,
            [FromQuery] Guid? goalId = null,
            [FromQuery] Guid? activityId = null,
            [FromQuery] DateOnly? date = null
        )
        {
            userId = _userContext.GetUserSecurityInfo().Id;

            return await _activityService.GetActivityLogs(
                UserId: userId,
                GoalId: goalId,
                ActivityId: activityId,
                Date: date
            );
        }

        [HttpGet("logs/today")]
        public async Task<ActionResult<List<ActivityLog>>> GetActivityLogsForToday(
            [FromQuery] string? userId = null,
            [FromQuery] Guid? goalId = null,
            [FromQuery] Guid? activityId = null,
            [FromQuery] int dayDifference = 0
        )
        {
            userId = _userContext.GetUserSecurityInfo().Id;

            return await _activityService.GetActivityLogs(
                UserId: userId,
                GoalId: goalId,
                ActivityId: activityId,
                Date: DateOnly.FromDateTime(DateTime.Now).AddDays(dayDifference)
            );
        }
    }
}