using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.UnitOfWork;
using FSU.SmartMenuWithAI.Service.ISerivice;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Utils.Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public SubscriptionService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<SubscriptionInfoDTO?> GetUserSubscriptionInfoAsync(int userId)
        {
            // Retrieve the user's last subscription
            // Define the filter expression to get subscriptions for the given user
            Expression<Func<Subscription, bool>> filter = x => x.UserId == userId && x.Status == 1;

            // Define the ordering to get the latest subscription first
            Func<IQueryable<Subscription>, IOrderedQueryable<Subscription>> orderBy = q => q.OrderByDescending(s => s.EndDate);

            // Call the Get method with filter, ordering, and other parameters
            var subscriptions = await _unitOfWork.SubscriptioRepository.Get(
                filter: filter,
                orderBy: orderBy,
                includeProperties: "Plan"//, // Include Plan details
                //pageIndex: null, // No pagination needed for fetching the latest record
                //pageSize: 1 // Fetch only the latest record
            );


            // Get the latest subscription (first record in the result)
            var latestSubscription = subscriptions.FirstOrDefault();

            var earliestStartDate = subscriptions.Min(s => s.StartDate);
            var latestEndDate = subscriptions.Max(s => s.EndDate);

            if (latestSubscription == null)
            {
                return null; // or handle as needed
            }

            // Retrieve full Plan details
            var plan = await _unitOfWork.PlanRepository.GetByID(latestSubscription.PlanId);
            if (plan == null) return null;

            // Retrieve the brand information
            var brand = await _unitOfWork.BrandRepository
                .GetByCondition(b => b.UserId == userId);

            int? brandId = brand?.BrandId; // Use null-conditional operator to handle null case

            // Count number of menus and stores for the brand
            int menuCount = brandId.HasValue
                ? await _unitOfWork.MenuRepository.Count(m => m.BrandId == brandId.Value)
                : 0;
            int storeCount = brandId.HasValue
                ? await _unitOfWork.StoreRepository.Count(s => s.BrandId == brandId.Value)
                : 0;

            // Retrieve payments for the user
            var payments = await _unitOfWork.PaymentRepository.Get(p => p.UserId == userId && p.Status == (int)PaymentStatus.Succeed,
                                                                    includeProperties: "Subscription,Subscription.Plan");

            //payments.OrderByDescending(p => p.PaymentDate);
            // Map payments to PaymentDTO
            var paymentDTOs = _mapper.Map<IEnumerable<PaymentDTO>>(payments);

            // Return the Subscription info with full Plan details
            return new SubscriptionInfoDTO
            {
                UserId = userId,
                SubscriptionId = latestSubscription.SubscriptionId,
                StartDate = earliestStartDate,
                EndDate = latestEndDate,

                // Plan details
                PlanId = plan.PlanId,
                PlanName = plan.PlanName,
                Price = plan.Price,
                MaxMenu = plan.MaxMenu,
                MaxAccount = plan.MaxAccount,

                // Counts for the brand
                MenuCount = menuCount,
                StoreCount = storeCount,

                // Payment details
                Payments = paymentDTOs.OrderByDescending(p => p.PaymentDate)
            };
        }
    }
}
