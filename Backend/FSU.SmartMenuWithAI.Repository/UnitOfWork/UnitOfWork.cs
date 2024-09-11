using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Repository.Repositories;
using Microsoft.Extensions.Configuration;


namespace FSU.SmartMenuWithAI.Repository.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IConfiguration _configuration;
        private RefreshTokenRepository _refreshTokenRepo;
        private SmartMenuContext _context;

        private AppUserRepository _appUserRepo;
        private AccountRepository _accountRepo;
        private GenericRepository<Category> _categoryRepo;
        private GenericRepository<Store> _storeRepo;
        private MenuRepository _menuRepo;
        private GenericRepository<Product> _productRepo;
        private MenuListRepository _menuListRepo;
        private BrandRepository _brandRepo;
        private GroupAttributeRepository _groupAttributeRepo;
        private AttributeRepository _attributeRepository;
        private ListPositionRepository _listPositionRepo;
        private CustomerSegmentRepository _customerSegmentRepo;
        private ProductListRepository _productListRepo;
        private MenuSegmentRepository _menuSegmentRepo;
        private GenericRepository<SegmentAttribute> _segmentAttributeRepo;
        private SegmentAttributeRepository _segmentAttributeRepo1;
        private PaymentRepository _paymentRepository;
        private PlanRepository _planRepository;
        private SubscriptioRepository _subscriptioRepository;


        public UnitOfWork(SmartMenuContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        public void Save()
        {
            _context.SaveChanges();
        }
        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }
        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }


        GenericRepository<Category> IUnitOfWork.CategoryRepository
        {
            get
            {
                if (_categoryRepo == null)
                {
                    this._categoryRepo = new GenericRepository<Category>(_context);
                }
                return _categoryRepo;
            }
        }

        public AppUserRepository AppUserRepository
        {
            get
            {
                if (_appUserRepo == null)
                {
                    this._appUserRepo = new AppUserRepository(_context);
                }
                return _appUserRepo;
            }
        }

        AccountRepository IUnitOfWork.AccountRepository
        {
            get
            {
                if (_accountRepo == null)
                {
                    this._accountRepo = new AccountRepository(_context, _configuration);
                }
                return _accountRepo;
            }
        }

        GenericRepository<Store> IUnitOfWork.StoreRepository
        {
            get
            {
                if (_storeRepo == null)
                {
                    this._storeRepo = new GenericRepository<Store>(_context);
                }
                return _storeRepo;
            }
        }
        MenuRepository IUnitOfWork.MenuRepository
        {
            get
            {
                if (_menuRepo == null)
                {
                    this._menuRepo = new MenuRepository(_context);
                }
                return _menuRepo;
            }
        }
        GenericRepository<Product> IUnitOfWork.ProductRepository
        {
            get
            {
                if (_productRepo == null)
                {
                    this._productRepo = new GenericRepository<Product>(_context);
                }
                return _productRepo;
            }
        }
       
        RefreshTokenRepository IUnitOfWork.RefreshTokenRepository
        {
            get
            {
                if (_refreshTokenRepo == null)
                {
                    this._refreshTokenRepo = new RefreshTokenRepository(_context, _configuration);
                }
                return _refreshTokenRepo;
            }
        }
        BrandRepository IUnitOfWork.BrandRepository
        {
            get
            {
                if (_brandRepo == null)
                {
                    this._brandRepo = new BrandRepository(_context, _configuration);
                }
                return _brandRepo;
            }
        }

        GroupAttributeRepository IUnitOfWork.GroupAttributeRepository
        {
            get
            {
                if (_groupAttributeRepo == null)
                {
                    this._groupAttributeRepo = new GroupAttributeRepository(_context, _configuration);
                }
                return _groupAttributeRepo;
            }
        }
        AttributeRepository IUnitOfWork.AttributeRepository
        {
            get
            {
                if (_attributeRepository == null)
                {
                    this._attributeRepository = new AttributeRepository(_context);
                }
                return _attributeRepository;
            }
        }
        ListPositionRepository IUnitOfWork.ListPositionRepository
        {
            get
            {
                if (_listPositionRepo == null)
                {
                    this._listPositionRepo = new ListPositionRepository(_context);
                }
                return _listPositionRepo;
            }
        }
        ProductListRepository IUnitOfWork.ProductListRepository
        {
            get
            {
                if (_productListRepo == null)
                {
                    this._productListRepo = new ProductListRepository(_context);
                }
                return _productListRepo;
            }
        }

        MenuListRepository IUnitOfWork.MenuListRepository
        {
            get
            {
                if (_menuListRepo == null)
                {
                    this._menuListRepo = new MenuListRepository(_context, _configuration);
                }
                return _menuListRepo;
            }
        }
       CustomerSegmentRepository IUnitOfWork.CustomerSegmentRepository
        {
            get
            {
                if (_customerSegmentRepo == null)
                {
                    this._customerSegmentRepo = new CustomerSegmentRepository(_context, _configuration);
                }
                return _customerSegmentRepo;
            }
        }
        MenuSegmentRepository IUnitOfWork.MenuSegmentRepository
        {
            get
            {
                if (_menuSegmentRepo == null)
                {
                    this._menuSegmentRepo = new MenuSegmentRepository(_context, _configuration);
                }
                return _menuSegmentRepo;
            }
        }
        GenericRepository<SegmentAttribute> IUnitOfWork.SegmentAttributeRepository
        {
            get
            {
                if (_segmentAttributeRepo == null)
                {
                    this._segmentAttributeRepo = new GenericRepository<SegmentAttribute>(_context);
                }
                return _segmentAttributeRepo;
            }
        }
        SegmentAttributeRepository IUnitOfWork.SegmentAttributeRepository1
        {
            get
            {
                if (_segmentAttributeRepo1 == null)
                {
                    this._segmentAttributeRepo1 = new SegmentAttributeRepository(_context);
                }
                return _segmentAttributeRepo1;
            }
        }
        PaymentRepository IUnitOfWork.PaymentRepository
        {
            get
            {
                if (_paymentRepository == null)
                {
                    this._paymentRepository = new PaymentRepository(_context);
                }
                return _paymentRepository;
            }
        }
        PlanRepository IUnitOfWork.PlanRepository
        {
            get
            {
                if (_planRepository == null)
                {
                    this._planRepository = new PlanRepository(_context);
                }
                return _planRepository;
            }
        }
        SubscriptioRepository IUnitOfWork.SubscriptioRepository
        {
            get
            {
                if (_subscriptioRepository == null)
                {
                    this._subscriptioRepository = new SubscriptioRepository(_context);
                }
                return _subscriptioRepository;
            }
        }
    }
}
