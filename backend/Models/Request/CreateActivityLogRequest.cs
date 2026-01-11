public class CreateActivityLogRequest
{
    public int Value { get; set; }
    public DateTime Date { get; set; }
    public Guid ActivityId { get; set; }
    public required string UserId { get; set; }
}