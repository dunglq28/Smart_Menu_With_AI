using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.AppUser
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Username is required")]
        [JsonProperty("use-namer")]
        public string UserName { get; set; } = string.Empty;
        [JsonProperty("password")]
        public string Password { get; set; } = string.Empty;
    }
}
