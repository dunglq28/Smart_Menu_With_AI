using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class AppUserDTO
    {
        public int? UserId { get; set; }

        public string? UserCode { get; set; } = null!;

        public string UserName { get; set; } = null!;

        public string? Password { get; set; } = null!;

        public int RoleId { get; set; }
        public string RoleName { get; set; } = null!;

        public DateOnly CreateDate { get; set; }

        public bool IsActive { get; set; }

        public int Status { get; set; }
        public string? Fullname { get; set; }

        public string? Phone { get; set; }

        public DateOnly? Dob { get; set; }

        public string? Gender { get; set; }

        public int? UpdateBy { get; set; }

        public DateOnly? UpdateDate { get; set; }
    }
}
