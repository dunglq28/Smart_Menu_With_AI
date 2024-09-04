using FSU.SmartMenuWithAI.Service.Models.Pagination;
using FSU.SmartMenuWithAI.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FSU.SmartMenuWithAI.Service.Models.Menu;

namespace FSU.SmartMenuWithAI.Service.ISerivice
{
    public interface ISegmentAttributeService
    {
        Task<CustomerSegmentDTO> GetCusSegmentAsync(CustomerFaceRognizeDTO imageValue);
    }
}
