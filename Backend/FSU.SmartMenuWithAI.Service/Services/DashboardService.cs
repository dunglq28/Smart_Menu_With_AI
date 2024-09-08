using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.Common.Enums;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models.ViewDashboard;
using System.Linq.Expressions;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public DashboardService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<DashboardDTO> GetDashboard()
        {
            var dashboardDTO = new DashboardDTO();
            Expression<Func<AppUser, bool>> filter = x => x.Status != (int)Status.Deleted;
            dashboardDTO.NumberOfUsers = await _unitOfWork.AppUserRepository.Count(filter: filter); ;
            dashboardDTO.NumberOfMenus = await _unitOfWork.MenuRepository.Count();
            dashboardDTO.TotalRevenue = 0;

            // Lấy thanh toán từ 6 tháng gần nhất
            var today = DateTime.Now;
            var sixMonthsAgo = new DateTime(today.Year, today.Month, 1).AddMonths(-5);

            // Lấy tất cả các payment trong 6 tháng gần nhất
            var allPayments = await _unitOfWork.PaymentRepository
                .Get(p => p.PaymentDate >= sixMonthsAgo && p.Status == 1);  // Chỉ lấy thanh toán hợp lệ
            // Tính tổng doanh thu cho từng tháng bằng cách lọc trong C#
            var monthlyRevenueList = new List<ListRevenue>();
            for (int i = 0; i < 6; i++)
            {
                var startDate = sixMonthsAgo.AddMonths(i);
                var endDate = startDate.AddMonths(1);

                // Tính toán doanh thu cho từng tháng trong C#
                var totalRevenueForMonth = 0m;
                foreach (var payment in allPayments)
                {
                    if (payment.PaymentDate >= startDate && payment.PaymentDate < endDate)
                    {
                        totalRevenueForMonth += payment.Amount ?? 0;
                    }
                }

                // Thêm kết quả vào danh sách doanh thu
                monthlyRevenueList.Add(new ListRevenue
                {
                    Year = startDate.Year,
                    Month = startDate.Month,
                    TotalRevenue = totalRevenueForMonth
                });
                //Cộng vào tổng doanh thu của tất cả các tháng
                dashboardDTO.TotalRevenue += totalRevenueForMonth;
            }

            // Sắp xếp danh sách doanh thu theo thứ tự từ tháng gần nhất
            monthlyRevenueList = monthlyRevenueList.OrderByDescending(r => r.Year).ThenByDescending(r => r.Month).ToList();

            // Gán danh sách vào dashboardDTO
            dashboardDTO.ListRevenue = monthlyRevenueList;

            // Lấy 30 người dùng mới nhất
            var LatestUsers = await _unitOfWork.AppUserRepository
                .Get(orderBy: q => q.OrderByDescending(u => u.CreateDate), filter: u => u.Status != (int)Status.Deleted);  // Ví dụ filter, điều chỉnh theo yêu cầu thực tế
                                                                                                                           // Lấy 30 người dùng đầu tiên
            dashboardDTO.LatestUsers = LatestUsers
                .Take(30)  // Lấy 30 người dùng đầu tiên
                .ToList();

            // Lấy 10 giao dịch gần nhất
            var recentTransactions = await _unitOfWork.PaymentRepository
                .Get(orderBy: q => q.OrderByDescending(p => p.PaymentDate)); 

            dashboardDTO.RecentTransactions = recentTransactions
                .Take(10)
                .Select(p => new TransactionDTO
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount,
                    PaymentDate = p.PaymentDate,
                    TransactionId = p.TransactionId,
                    Email = p.Email,
                    Status = p.Status
                })
                .ToList();

            var sixMonthsAgo2 = DateOnly.FromDateTime(new DateTime(today.Year, today.Month, 1).AddMonths(-5));

            // Retrieve all brands created in the last 6 months
            var brands = await _unitOfWork.BrandRepository
                .Get(b => b.CreateDate >= sixMonthsAgo2 && b.Status != (int)Status.Deleted);

            // Calculate the number of brands created each month
            var brandCounts = brands
                .GroupBy(b => new { b.CreateDate.Year, b.CreateDate.Month })
                .Select(g => new ListBrand
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalBrands = g.Count()
                })
                .OrderByDescending(b => b.Year)
                .ThenByDescending(b => b.Month)
                .ToList();

            // Assign the brand counts to the DTO
            dashboardDTO.ListBrandCounts = brandCounts;
            return dashboardDTO;
        }
    }
}
