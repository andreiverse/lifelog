public class HealthResponse
{
    public DateTime Timestamp { get; } 
    public bool Ok { get; }
    
    public HealthResponse(bool isOk)
    {
        this.Timestamp = DateTime.Now;
        this.Ok = isOk;
    }
}