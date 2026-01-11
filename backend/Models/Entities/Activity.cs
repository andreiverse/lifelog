namespace backend.Models.Entities
{
    public class Activity
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public string? Unit { get; set; }
        public Guid GoalId { get; set; } 
        public required Goal Goal { get; set; }
    }

}