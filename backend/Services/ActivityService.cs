using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ActivityService(ApplicationDbContext applicationDbContext)
    {
        private readonly ApplicationDbContext _applicationDbContext = applicationDbContext;

        public async Task<List<Activity>> GetActivities(
            string? UserId = null,
            Guid? GoalId = null
        )
        {
            IQueryable<Activity> query = _applicationDbContext.Activities
                .Include(a => a.Goal);

            if (GoalId != null)
                query = query.Where(a => a.GoalId == GoalId);

            if (UserId != null)
                query = query.Where(a => a.Goal.UserId == UserId);

            return await query.ToListAsync();
        }

        public async Task<List<ActivityLog>> GetActivityLogs(
            string? UserId = null,
            Guid? GoalId = null,
            Guid? ActivityId = null,
            DateOnly? Date = null
        )
        {
            IQueryable<ActivityLog> query = _applicationDbContext.ActivityLogs
                .Include(al => al.Activity).Include(al => al.Activity.Goal);

            if (UserId != null)
                query = query.Where(a => a.Activity.Goal.UserId == UserId);

            if (ActivityId != null)
                query = query.Where(a => a.ActivityId == ActivityId);

            if (GoalId != null)
                query = query.Where(a => a.Activity.GoalId == GoalId);

            if (Date != null)
            {
                var localDateTime = Date.Value.ToDateTime(TimeOnly.MinValue);
                var utcDateTime = DateTime.SpecifyKind(localDateTime, DateTimeKind.Utc);

                query = query.Where(a => a.Date.Date == utcDateTime.Date);
            }

            return await query.ToListAsync();
        }

        public async Task<Activity> NewActivity(
            CreateActivityRequest createActivityRequest
        )
        {
            Goal? goal = await _applicationDbContext.Goals.FindAsync(createActivityRequest.GoalId)
                ?? throw new InvalidDataException("couldn't find goal");

            if (goal.UserId != createActivityRequest.UserId)
                throw new UnauthorizedAccessException("you are not allowed to create an activity for this goal");

            Activity activity = new()
            {
                Goal = goal,
                GoalId = goal.Id,

                Title = createActivityRequest.Title,
                Unit = createActivityRequest.Unit,
            };

            _applicationDbContext.Add(activity);
            await _applicationDbContext.SaveChangesAsync();

            return activity;
        }


        public async Task<ActivityLog> NewActivityLog(
            CreateActivityLogRequest createActivityLogRequest
        )
        {
            Activity? activity = await _applicationDbContext.Activities
                .Include(a => a.Goal)
                .FirstOrDefaultAsync(a => a.Id == createActivityLogRequest.ActivityId)
                    ?? throw new InvalidDataException("couldn't find activity");

            if (activity.Goal.UserId != createActivityLogRequest.UserId)
                throw new UnauthorizedAccessException("you are not allowed to create a log for this activity");

            ActivityLog activityLog = new()
            {
                Activity = activity,
                ActivityId = activity.Id,

                Date = createActivityLogRequest.Date,
                Value = createActivityLogRequest.Value
            };

            _applicationDbContext.Add(activityLog);
            await _applicationDbContext.SaveChangesAsync();

            return activityLog;
        }
    }
}