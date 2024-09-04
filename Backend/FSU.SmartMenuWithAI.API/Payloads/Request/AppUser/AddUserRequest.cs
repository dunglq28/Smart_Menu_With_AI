using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.AppUser
{
    public class AddUserRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        [RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "Chỉ được chứa chữ cái và số")]
        [JsonProperty("username")]
        public string UserName { get; set; } = null!;

        [Range(1, 3)]
        [JsonProperty("role-id")]
        public int RoleId { get; set; }

        [Required]
        [JsonProperty("is-active")]
        public bool IsActive { get; set; }


        [StringLength(100, MinimumLength = 3)]
        [JsonProperty("fullname")]

        public string? Fullname { get; set; }

        [Phone]
        [JsonProperty("phone")]
        public string? Phone { get; set; }
        [Required]
        [JsonProperty("dob")]
        public DateOnly? Dob { get; set; }

        [StringLength(10)]
        [JsonProperty("gender")]
        public string? Gender { get; set; }
        [JsonProperty("update-by")]
        public int? UpdateBy { get; set; } = 0;

    }
    
}
