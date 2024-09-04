using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models.ViewModel
{
    public class CategoryViewModel
    {
        public int CategoryId { get; set; }

        public string CategoryCode { get; set; } = null!;

        public string CategoryName { get; set; } = null!;
    }
}
