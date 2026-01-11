namespace backend.Models.Entities
{
    public class Goal
    {
        public Guid Id { get; set; }
        public required string UserId { get; set; }
        public required string Name { get; set; }
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
    }
}