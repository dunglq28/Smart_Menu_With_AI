namespace FSU.SmartMenuWithAI.API.Payloads.Responses
{
    public class BaseResponse
    {
        public int StatusCode { get; set; }
        public string? Message { get; set; } = string.Empty;
        public bool IsSuccess { get; set; }

        public object? Data { get; set; } = null!;
        public IDictionary<string, string[]> Errors { get; set; } = null!;
    }
}
