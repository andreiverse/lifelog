using Lifelog.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
namespace Lifelog.Controllers
{
    [ApiController]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    [Route("api/security")]
    public class SecurityController : ControllerBase
    {
        private readonly UserContext _userContext;

        public SecurityController(UserContext userContext)
        {
            _userContext = userContext;
        }

        [HttpGet("login")]
        [AllowAnonymous]
        public IActionResult Login(string? redirectUri)
        {
            // todo: prevent open redirect vulnerability
            return Challenge(
                properties: new AuthenticationProperties{ RedirectUri = redirectUri ?? "/" },
                authenticationSchemes: [ "OpenIdConnect" ] );
        }
        
        [HttpGet]
        [Authorize]
        public ActionResult<SecurityInfo> Get()
        {
            var user = _userContext.GetUserSecurityInfo();
        
            if (user == null)
                return Unauthorized(); 

            return user;
        }
    }
}