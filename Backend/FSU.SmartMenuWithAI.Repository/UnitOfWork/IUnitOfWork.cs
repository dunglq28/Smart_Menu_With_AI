using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Repositories;


namespace FSU.SmartMenuWithAI.Repository.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        void Save();
        Task<int> SaveAsync();
        public GenericRepository<Category> CategoryRepository { get; }
        public RefreshTokenRepository RefreshTokenRepository { get; }
        public AppUserRepository AppUserRepository { get; }
        public AccountRepository AccountRepository { get; }
        public GenericRepository<Store> StoreRepository { get; }
        public MenuRepository MenuRepository { get; }
        public GenericRepository<Product> ProductRepository { get; }
        public MenuListRepository MenuListRepository { get; }
        public BrandRepository BrandRepository { get; }
        public GroupAttributeRepository GroupAttributeRepository { get; }
        public AttributeRepository AttributeRepository { get; }
        public ListPositionRepository ListPositionRepository { get; }
        public CustomerSegmentRepository CustomerSegmentRepository { get; }
        public MenuSegmentRepository MenuSegmentRepository { get; }
        public GenericRepository<SegmentAttribute> SegmentAttributeRepository { get; }

        public ProductListRepository ProductListRepository { get; }
        public SegmentAttributeRepository SegmentAttributeRepository1 { get; }
        public PaymentRepository PaymentRepository { get; }
        public PlanRepository PlanRepository { get; }
        public SubscriptioRepository SubscriptioRepository { get; }
    }
}
