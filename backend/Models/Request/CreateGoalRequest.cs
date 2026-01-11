public class CreateGoalRequest
{
    public required string UserId { get; set; }
    public required string Name { get; set; }
    public required DateTime Start { get; set; }
    public required DateTime Finish { get; set; }
}
