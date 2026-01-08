using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Lifelog.Services
{

    public class UserContext
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserContext(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
        }

        private static List<string> RequiredClaims = [ ClaimTypes.NameIdentifier, "name", "preferred_username" ] ;

        public SecurityInfo? GetUserSecurityInfo()
        {
            var user = this.httpContextAccessor.HttpContext?.User;

            if (user?.Identity == null || !user.Identity.IsAuthenticated)
                throw new UnauthorizedAccessException();

            if (!RequiredClaims.All(ClaimValue => user.HasClaim(c => c.Type == ClaimTypes.NameIdentifier)))
                throw new BadHttpRequestException("missing claims");

            var groups = user.Claims
                    .Where(c => c.Type == ClaimTypes.Role || c.Type == "groups")
                    .Select(c => c.Value)
                    .ToList();

            return new SecurityInfo
            {
                Id = user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty,
                Claims = user.Claims.GroupBy(c => c.Type)
                    .ToDictionary(c => c.Key, c => c.Select(c => c.Value).ToList()),
                Groups = groups,
                Name = user.FindFirst("name")?.Value ?? string.Empty,
                Username = user.FindFirst("preferred_username")?.Value ?? string.Empty
            };
        }
    }
}