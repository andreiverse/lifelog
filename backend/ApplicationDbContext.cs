using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
public class ApplicationDbContext : DbContext
{
    public DbSet<Goal> Goals { get; set; } 
    public DbSet<Activity> Activities {get;set;}
    public DbSet<ActivityLog> ActivityLogs {get;set;}
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Server=127.0.0.1;Port=5432;Database=lifelog;User Id=postgres;Password=example;");
    }
}
