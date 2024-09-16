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

        //return data for 2024 year
        public async Task<DashboardDTO> GetDashboard()
        {
            var dashboardDTO = new DashboardDTO();
            Expression<Func<AppUser, bool>> filter = x => x.Status != (int)Status.Deleted && x.CreateDate.Year == 2024;
            dashboardDTO.NumberOfUsers = await _unitOfWork.AppUserRepository.Count(filter: filter); 
            dashboardDTO.NumberOfBrands = await _unitOfWork.BrandRepository.Count(x => x.CreateDate.Year == 2024 && x.Status != (int)Status.Deleted);
            dashboardDTO.TotalRevenue = 0;

            var allPayments = await _unitOfWork.PaymentRepository
                .Get(p => p.PaymentDate.Year == 2024 && p.Status == 1);  // Chỉ lấy thanh toán hợp lệ
            // Tính tổng doanh thu cho từng tháng bằng cách lọc trong C#
            var monthlyRevenueList = new List<ListRevenue>();
            for (int i = 1; i <= DateTime.Now.Month ; i++)
            {
                var startDate = new DateTime(2024, i, 1);
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
            //monthlyRevenueList = monthlyRevenueList.OrderByDescending(r => r.Year).ThenByDescending(r => r.Month).ToList();

            // Gán danh sách vào dashboardDTO
            dashboardDTO.ListRevenue = monthlyRevenueList;

            // Lấy 30 người dùng mới nhất
            var LatestUsers = await _unitOfWork.AppUserRepository
                .Get(orderBy: q => q.OrderByDescending(u => u.CreateDate), filter: u => u.Status != (int)Status.Deleted && u.CreateDate.Year == 2024);  // Ví dụ filter, điều chỉnh theo yêu cầu thực tế
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

            // Define the start of the year 2024 and the current date
            var startOf2024 = new DateOnly(2024, 1, 1);
            var today = DateOnly.FromDateTime(DateTime.Today); // Current date

            // Retrieve all brands created from the start of 2024 to today
            var brands = await _unitOfWork.BrandRepository
                .Get(b => b.CreateDate >= startOf2024 && b.CreateDate <= today && b.Status != (int)Status.Deleted);

            // Create a list of all months from January to the current month in 2024
            var allMonths2024 = Enumerable.Range(1, today.Month)
                .Select(month => new { Year = 2024, Month = month })
                .ToList();

            // Calculate the number of brands created each month from January to the current month in 2024
            var brandCounts = brands
                .GroupBy(b => new { b.CreateDate.Year, b.CreateDate.Month })
                .Select(g => new ListBrand
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalBrands = g.Count()
                })
                .ToList();

            // Merge with all months to ensure each month is included, even if no brands were created
            var monthlyBrandCounts = allMonths2024
                .Select(month => new ListBrand
                {
                    Year = month.Year,
                    Month = month.Month,
                    TotalBrands = brandCounts
                        .FirstOrDefault(b => b.Year == month.Year && b.Month == month.Month)?.TotalBrands ?? 0
                })
                .OrderBy(b => b.Month) // Order from January to the current month
                .ToList();

            // Assign the brand counts to the DTO
            dashboardDTO.ListBrandCounts = monthlyBrandCounts;
            return dashboardDTO;
        }
    }
}
