public class CreateActivityRequest
{
    public required string Title { get; set; }
    public string? Unit { get; set; }
    public required string UserId { get; set; }
    public Guid GoalId { get; set; }
}
