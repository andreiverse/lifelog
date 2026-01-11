public class HealthResponse(bool isOk)
{
    public DateTime Timestamp { get; } = DateTime.Now;
    public bool Ok { get; } = isOk;
}