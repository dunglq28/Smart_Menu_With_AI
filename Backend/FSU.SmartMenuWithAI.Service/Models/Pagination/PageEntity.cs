using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models.Pagination
{
    public class PageEntity<T>
    {
        public IEnumerable<T> List { get; set; } = new List<T>();

        public int TotalPage { get; set; }

        public int TotalRecord { get; set; }
    }
}
