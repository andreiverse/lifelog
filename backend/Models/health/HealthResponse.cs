public class HealthResponse
{
    public DateTime Timestamp { get; } 
    public bool Ok { get; }
    
    public HealthResponse(bool isOk)
    {
        Timestamp = DateTime.Now;
        Ok = isOk;
    }
}