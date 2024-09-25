namespace FSU.SmartMenuWithAI.API.Payloads
{
    public static class APIRoutes
    {
        public const string Base = "api";

        public static class SmartMenu
        {
            public const string GetAll = Base + "/weatherforecast/";
        }

        public static class Authentication
        {
            public const string Login = Base + "/authentication/login";
            public const string LoginMobile = Base + "/authentication/login-mobile";

            public const string RefreshToken = Base + "/authentication/refresh-token";

        }
        public static class Account
        {
            public const string ChangePassword = Base + "/account/change-password";

            public const string BanAccount = Base + "/account/ban-account";
        }
        public static class Checkout
        {
            public const string CheckoutPayOs = Base + "/PayOS/create-payment-link";
            public const string GetPaymentLink = Base + "/PayOS/get-payment-link";
            public const string Extend = Base + "/PayOS/Extend/create-payment-link";
        }
        public static class Email
        {
            public const string SendVerificationCode = Base + "/send-verification-code";
        }
        public static class AppUser
        {
            public const string GetAll = Base + "/app-users/";

            public const string GetByID = Base + "/app-users/get-by-id";

            public const string Update = Base + "/app-users/";

            public const string Delete = Base + "/app-users/";

            public const string Add = Base + "/app-users/";
        }
        public static class Attribute
        {
            public const string GetAll = Base + "/attributes/";

            public const string GetByID = Base + "/attributes/get-by-id";

            public const string Update = Base + "/attributes/";

            public const string Delete = Base + "/attributes/";

            public const string Add = Base + "/attributes/";
        }

        public static class Brand
        {
            public const string GetAll = Base + "/brands/";

            public const string GetAllName = Base + "/brands/get-all-name";

            public const string GetByID = Base + "/brands/get-by-id";

            public const string Add = Base + "/brands/add";

            public const string Update = Base + "/brands/update";

            public const string Delete = Base + "/brands/delete";

            public const string GetByUserID = Base + "/brands/get-by-user-id";

            public const string GetByName = Base + "/brands/get-by-name";

            public const string CheckLimit = Base + "/brands/checklimit/{user-id}";

            public const string GetDashboard = Base + "/brands/dashboard/{brand-id}";
        }

        public static class Store
        {
            public const string GetAll = Base + "/stores/";

            public const string GetByID = Base + "/stores/get-by-id";

            public const string Update = Base + "/stores/";

            public const string Delete = Base + "/stores/";

            public const string Add = Base + "/stores/";

            public const string GetByUserID = Base + "/stores/get-brand-of-store-by-user-id";
        }

        public static class Category
        {
            public const string GetAll = Base + "/categories/";

            public const string GetByID = Base + "/categories/get-by-id";

            public const string GetByBrandID = Base + "/categories/get-by-brand-id";

            public const string Update = Base + "/categories/";

            public const string Delete = Base + "/categories/";

            public const string Add = Base + "/categories/";
        }

        public static class Menu
        {
            public const string GetAll = Base + "/menus/";

            public const string GetByID = Base + "/menus/get-by-id";

            public const string Update = Base + "/menus/";

            public const string Delete = Base + "/menus/";

            public const string Add = Base + "/menus/";

            public const string RecommendMenu = Base + "/menus/recommend-menu";

            public const string GetMenuSegmentByID = Base + "/menu-segments/get-by-id";

            public const string DeleteMenuSegment = Base + "/menu-segmnets/delete-menu-segment";

            public const string UpdateMenuSegment = Base + "/menu-segmnets/update-menu-segment";


        }

        public static class GroupAttribute
        {
            public const string GetAll = Base + "/group-attributes/";
            public const string GetByID = Base + "/group-attributes/get-by-id";

            public const string Add = Base + "/group-attributes/add";

            public const string Update = Base + "/group-attributes/update";

            public const string Delete = Base + "/group-attributes/delete";
        }
        public static class Product
        {
            public const string GetAllByCategory = Base + "/products/get-by-category";

            public const string Add = Base + "/products/";

            public const string Update = Base + "/products/";

            public const string Delete = Base + "/products/";

            public const string GetByID = Base + "/products/get-by-id";

            public const string GetAll = Base + "/products/";

            public const string testRecogize = Base + "/products/test-recogize";
        }
        public static class ProductMenu
        {
            public const string GetAll = Base + "/products-menu/";

            public const string GetByID = Base + "/products-menu/get-by-id";

            public const string GetProductNotInMenu = Base + "/products-menu/get-product-not-in-menu";

            public const string Update = Base + "/products-menu/";

            public const string Delete = Base + "/products-menu/";

            public const string Add = Base + "/products-menu/";
        }
        public static class ListPosition
        {
            public const string GetByID = Base + "/list-positions/get-by-id";

            public const string GetByBrandID = Base + "/list-positions/get-by-brand-id";

            public const string Add = Base + "/list-positions/";
            public const string AddListList = Base + "/list-positions/add-list-list";


            public const string Update = Base + "/list-positions/";
            public const string UpdateListList = Base + "/list-positions/update-list-list";


            public const string Delete = Base + "/list-positions/";

        }
        public static class ProductList
        {
            public const string GetByID = Base + "/product-lists/get-by-id";

            public const string Add = Base + "/product-lists/add";
            public const string AddListProduct = Base + "/product-lists/add-list-product";

            public const string Update = Base + "/product-lists/update";
            public const string UpdateListProduct = Base + "/product-lists/update-list-product";

            public const string Delete = Base + "/product-lists/delete";

        }



        public static class MenuList
        {
            public const string GetAll = Base + "/menu-list/";

            public const string GetByID = Base + "/menu-list/get-by-id";

            public const string GetProductNotInMenu = Base + "/menu-list/get-product-not-in-menu";

            public const string Update = Base + "/menu-list/";

            public const string Delete = Base + "/menu-list/";

            public const string Add = Base + "/menu-list/";

            public const string AddOneRow = Base + "/menu-list/add-one-list-to-menu";
        }

        public static class CustomerSegment
        {
            public const string GetAll = Base + "/customer-segments/";

            public const string GetAllNoPaging = Base + "/customer-segments/no-paging";

            public const string GetByID = Base + "/customer-segments/get-by-id";

            public const string GetByMenuID = Base + "/customer-segments/{menu-id}";

            public const string UpdateName = Base + "/customer-segments/update-name";

            public const string UpdateValue = Base + "/customer-segments/update-value";

            public const string Delete = Base + "/customer-segments/";

            public const string Add = Base + "/customer-segments/";
        }
        public static class Dashboard
        {
            public const string GetAll = Base + "/dashboard/";

        }
        public static class Plan
        {
            public const string GetAll = Base + "/plans/";

            public const string GetByID = Base + "/plans/get-by-id";

            public const string Add = Base + "/plans/";

            public const string Delete = Base + "/plans/";

            public const string Update = Base + "/plans/";
        }
        public static class Payment
        {
            public const string Get = Base + "/payments/";

            public const string Add = Base + "/payments/";

            public const string Update = Base + "/payments/";

            public const string GetByEmail = Base + "/payments/get-by-email";

            public const string GetByEmail2 = Base + "/payments/check-exist-email";

        }
        public static class Subscription
        {
            public const string Get = Base + "/subscriptions/";

            public const string GetInfo = Base + "/subscriptions/{userId}";
        }
    }
}
