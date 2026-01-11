using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class GoalService(ApplicationDbContext applicationDbContext)
    {
        private readonly ApplicationDbContext _applicationDbContext = applicationDbContext;

        public async Task<List<Goal>> GetGoals(
            string? UserId = null
        )
        {
            IQueryable<Goal> query = _applicationDbContext.Goals;

            if (UserId != null)
                query = query.Where(u => u.UserId == UserId);

            return await query.ToListAsync();
        }

        public async Task<Goal> NewGoal(CreateGoalRequest createGoalRequest)
        {
            var goal = new Goal
            {
                Id = Guid.NewGuid(),
                UserId = createGoalRequest.UserId,
                Start = createGoalRequest.Start.ToUniversalTime(),
                Finish = createGoalRequest.Finish.ToUniversalTime(),
                Name = createGoalRequest.Name
            };

            _applicationDbContext.Goals.Add(goal);
            await _applicationDbContext.SaveChangesAsync();

            return goal;
        }
    }
}