using AutoMapper;
using FSU.SmartMenuWithAI.Repository.Entities;
using FSU.SmartMenuWithAI.Service.Models;
using FSU.SmartMenuWithAI.Service.Models.CustomerSegment;
using FSU.SmartMenuWithAI.Service.Models.MenuList;
using FSU.SmartMenuWithAI.Service.Models.Token;
using FSU.SmartMenuWithAI.Service.Models.ViewModel;
using Attribute = FSU.SmartMenuWithAI.Repository.Entities.Attribute;


namespace FSU.SmartMenuWithAI.Service.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapping classes
            // user
            CreateMap<AppUser, AppUserDTO>()
                //.ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.RoleName))
                //.ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brands.Select(b => b.BrandName).FirstOrDefault()))
                .ReverseMap(); // Lấy tên của Brand đầu tiên.ReverseMap(); // Mapping BrandName từ Store và Brand.ReverseMap();
            CreateMap<Token, TokenDto>().ReverseMap();
            CreateMap<RefreshToken, RefreshTokenDTO>().ReverseMap();
            // store
            CreateMap<Store, StoreDTO>().ReverseMap();
            // brand
            CreateMap<Brand, BrandDTO>().ReverseMap();
            // menu
            CreateMap<Menu, MenuDTO>()
                .ForMember(dto => dto.BrandName, opt => opt.MapFrom(entity => entity.Brand.BrandName))
                .ForMember(dto => dto.MenuLists, opt => opt.MapFrom(entity => entity.MenuLists))
                .ForMember(dto => dto.MenuSegments, opt => opt.MapFrom(entity => entity.MenuSegments))
                .ReverseMap();
            // category
            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<Category, CategoryViewModel>().ReverseMap();
            // product
            CreateMap<Product, ProductDTO>()
                .ForMember(dto => dto.CategoryName, opt => opt.MapFrom(obj => obj.Category.CategoryName))
                .ReverseMap();
            // attribute
            CreateMap<Attribute, AttributeDTO>().ReverseMap();
            CreateMap<GroupAttribute, GroupAttributeDTO>().ReverseMap();
            // menu list
            CreateMap<MenuList, MenuListDTO>()
                .ForMember(dto => dto.List, opt => opt.MapFrom(src => src.List))
                .ForMember(dto => dto.Menu, opt => opt.MapFrom(src => src.Menu))
                .ReverseMap();
            CreateMap<MenuList, CreateMenuListDTO>().ReverseMap();
            // listPosition
            CreateMap<ListPosition, ListPositionDTO>()
                .ForMember(dto => dto.MenuLists, opt => opt.MapFrom(src => src.MenuLists))
                .ForMember(dto => dto.ProductLists, opt => opt.MapFrom(src => src.ProductLists))
                .ReverseMap();
            // Customer segment
            CreateMap<CustomerSegment, CustomerSegmentDTO>()
                .ForMember(dest => dest.SegmentAttributes, opt => opt.MapFrom(src => src.SegmentAttributes))
                .ReverseMap();
            CreateMap<SegmentAttribute, SegmentAttributeDTO>()
                .ForMember(dest => dest.AttributeName, opt => opt.MapFrom(src => src.Attribute.AttributeName))
                .ReverseMap();
            CreateMap<SegmentAttribute, AddAttributeSegmentDTO>().ReverseMap();
            //productlist
            CreateMap<ProductList, ProductListDTO>()
                .ForMember(dto => dto.List, opt => opt.MapFrom(src => src.List))
                .ForMember(dto => dto.Product, opt => opt.MapFrom(src => src.Product))
                .ReverseMap();
            //menu segment
            CreateMap<MenuSegment, MenuSegmentDTO>()
                .ForMember(dest => dest.brandId, opt => opt.MapFrom(src => src.Menu.BrandId))
                .ReverseMap();
            CreateMap<Plan, PlanDTO>().ReverseMap();
            CreateMap<Payment, PaymentDTO>()
                .ForMember(dest => dest.SubscriptionId, opt => opt.MapFrom(src => src.Subscription!.SubscriptionId))
                .ForMember(dest => dest.PlanId, opt => opt.MapFrom(src => src.Subscription!.Plan.PlanId))
                .ForMember(dest => dest.PlanName, opt => opt.MapFrom(src => src.Subscription!.Plan.PlanName))
                .ReverseMap();
            CreateMap<Subscription, SubscriptionDTO>().ReverseMap();

        }
    }
}
