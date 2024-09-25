using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models.ViewDashboard
{
    public class BrandDashboardDTO
    {
        public int store { get; set; }
        public int menus { get; set; }
        public int product { get; set; }
        public List<TimesRecomment>? timesRecomments { get; set; }
        public List<ProductByCate>? productsByCate { get; set; }
    }

    public class TimesRecomment
    {
        public int menuid { get; set; }
        public int times { get; set; }
        public string? description { get; set; }
    }

    public class ProductByCate
    {
        public int numberOfProduct { get; set; }
        public string cateName { get; set; }
    }
}
