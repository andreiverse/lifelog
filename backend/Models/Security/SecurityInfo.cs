using System.Security.Claims;

public class SecurityInfo
{
    public required string Id { get; set; }
    public required Dictionary<string, List<string>> Claims { get; set; } 
    public required List<string> Groups { get; set; }
    public required string Username { get; set; }
    public required string Name {get;set;}
    
    public bool isInGroup(string group)
    {
        return Groups.Contains(group);
    }
}