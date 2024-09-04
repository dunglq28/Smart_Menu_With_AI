using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.API.Payloads.Request.Store
{

    public class AddStoreRequest
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        [MaxLength(100)]
        public string City { get; set; }

        [Required]
        public int BrandId { get; set; }
    }
}
