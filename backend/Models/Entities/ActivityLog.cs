namespace backend.Models.Entities
{
    public class ActivityLog
    {
        public Guid Id { get; set; }
        public int Value { get; set; }
        public DateTime Date { get; set; }
        public Guid ActivityId { get; set; }
        public required Activity Activity { get; set; }
    }
}