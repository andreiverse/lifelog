using Lifelog.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.ObjectPool;

namespace Lifelog.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/security")]
    public class SecurityController : ControllerBase
    {
        private readonly UserContext userContext;

        public SecurityController(UserContext userContext)
        {
            this.userContext = userContext;
        }


        [HttpGet]
        public ActionResult<SecurityInfo> Get()
        {
            var user = this.userContext.GetUserSecurityInfo();
        
            if (user == null)
                return Unauthorized(); 

            return user;
        }
    }
}