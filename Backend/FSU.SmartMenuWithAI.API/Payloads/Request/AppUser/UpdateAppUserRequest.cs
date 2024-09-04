using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.AppUser
{
    public class UpdateAppUserRequest
    {

        [Required]
        [JsonProperty("is-active")]
        public bool IsActive { get; set; }

        [StringLength(50, MinimumLength = 3)]
        [JsonProperty("full-name")]
        public string? Fullname { get; set; }

        [Phone]
        [JsonProperty("phone")]
        public string? Phone { get; set; }
        [JsonProperty("dob")]
        public DateOnly? Dob { get; set; }

        [StringLength(10)]
        [JsonProperty("gender")]
        public string? Gender { get; set; }
        [Required]
        [JsonProperty("update-by")]
        public int? UpdateBy { get; set; }

    }
}
