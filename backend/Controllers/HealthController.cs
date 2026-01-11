using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public ActionResult<HealthResponse> Get()
        {
            return new HealthResponse(true);
        }
    }
}