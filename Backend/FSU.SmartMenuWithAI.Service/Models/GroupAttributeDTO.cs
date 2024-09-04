

namespace FSU.SmartMenuWithAI.Service.Models
{
    public class GroupAttributeDTO
    {
        public int GroupAttributeId { get; set; }

        public string GroupAttributeName { get; set; } = null!;

        public DateOnly CreateDate { get; set; }
    }
}
