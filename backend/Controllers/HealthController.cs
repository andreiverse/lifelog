using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lifelog.Controllers
{
    [ApiController]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
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