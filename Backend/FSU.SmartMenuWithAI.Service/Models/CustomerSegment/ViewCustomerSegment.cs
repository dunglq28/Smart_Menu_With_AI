namespace FSU.SmartMenuWithAI.Service.Models.CustomerSegment
{
    public class ViewCustomerSegment
    {
        public int CustomerSegmentId { get; set; }
        public string CustomerSegmentName { get; set; }
        public string Demographic { get; set; }
        public string Age { get; set; }
        public DateOnly CreateDate { get; set; }
        public DateOnly? UpdateDate { get; set; }   
    }
}
