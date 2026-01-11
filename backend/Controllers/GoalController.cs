using backend.Models.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/goals")]
    public class GoalController(GoalService goalService, UserContext userContext) : ControllerBase {

        private readonly GoalService _goalService = goalService;
        private readonly UserContext _userContext = userContext;

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Goal>> NewGoal([FromBody] CreateGoalRequest createGoalRequest)
        {
            createGoalRequest.UserId = _userContext.GetUserSecurityInfo().Id;

            return await _goalService.NewGoal(createGoalRequest);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<Goal>>> GetGoals([FromQuery] string? userId = null) 
        {
            userId = _userContext.GetUserSecurityInfo().Id;

            return await _goalService.GetGoals(UserId: userId);
        }
    }
}