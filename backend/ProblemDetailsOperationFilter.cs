using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;

using Swashbuckle.AspNetCore.SwaggerGen;

public class ProblemDetailsOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (operation.Responses == null)
            return;

        if (operation.Responses.ContainsKey("500"))
            return;

        operation.Responses["500"] = new OpenApiResponse
        {
            Description = "Internal Server Error",
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["application/problem+json"] = new OpenApiMediaType
                {
                    Schema = context.SchemaGenerator.GenerateSchema(
                        typeof(ProblemDetails),
                        context.SchemaRepository
                    )
                }
            }
        };
    }
}
