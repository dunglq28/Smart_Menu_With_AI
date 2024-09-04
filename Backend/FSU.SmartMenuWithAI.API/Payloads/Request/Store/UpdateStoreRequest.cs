using System.ComponentModel.DataAnnotations;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Store
{
    public class UpdateStoreRequest
    {
        [Required]
        public bool IsActive { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        [MaxLength(100)]
        public string City { get; set; }

    }
}
