using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace FSU.SmartMenuWithAI.Repository.Entities;

public partial class SmartMenuContext : DbContext
{
    public SmartMenuContext()
    {
    }

    public SmartMenuContext(DbContextOptions<SmartMenuContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AppUser> AppUsers { get; set; }

    public virtual DbSet<Attribute> Attributes { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<CustomerSegment> CustomerSegments { get; set; }

    public virtual DbSet<CustomerVisit> CustomerVisits { get; set; }

    public virtual DbSet<GroupAttribute> GroupAttributes { get; set; }

    public virtual DbSet<ListPosition> ListPositions { get; set; }

    public virtual DbSet<Menu> Menus { get; set; }

    public virtual DbSet<MenuList> MenuLists { get; set; }

    public virtual DbSet<MenuSegment> MenuSegments { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Plan> Plans { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductList> ProductLists { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Screen> Screens { get; set; }

    public virtual DbSet<ScreenMenu> ScreenMenus { get; set; }

    public virtual DbSet<SegmentAttribute> SegmentAttributes { get; set; }

    public virtual DbSet<Store> Stores { get; set; }

    public virtual DbSet<Subscription> Subscriptions { get; set; }

    public virtual DbSet<VisitAttribute> VisitAttributes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__AppUser__1788CCAC83F89E0E");

            entity.ToTable("AppUser");

            entity.HasIndex(e => e.UserCode, "UQ__AppUser__1DF52D0C13CF0F58").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Fullname).HasMaxLength(50);
            entity.Property(e => e.Gender)
                .HasMaxLength(6)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CS_AS");
            entity.Property(e => e.Phone)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.UserCode).HasMaxLength(36);
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .UseCollation("SQL_Latin1_General_CP1_CS_AS");

            entity.HasOne(d => d.Role).WithMany(p => p.AppUsers)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AppUser__RoleID__3A81B327");
        });

        modelBuilder.Entity<Attribute>(entity =>
        {
            entity.HasKey(e => e.AttributeId).HasName("PK__Attribut__C189298A976544B3");

            entity.ToTable("Attribute");

            entity.HasIndex(e => e.AttributeCode, "UQ__Attribut__BD3ED16E2BC7F1FC").IsUnique();

            entity.Property(e => e.AttributeId).HasColumnName("AttributeID");
            entity.Property(e => e.AttributeCode).HasMaxLength(36);
            entity.Property(e => e.AttributeName).HasMaxLength(100);
            entity.Property(e => e.GroupAttributeId).HasColumnName("GroupAttributeID");

            entity.HasOne(d => d.GroupAttribute).WithMany(p => p.Attributes)
                .HasForeignKey(d => d.GroupAttributeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Attribute__Group__628FA481");
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.BrandId).HasName("PK__Brand__DAD4F3BE71AF29AC");

            entity.ToTable("Brand");

            entity.HasIndex(e => e.BrandCode, "UQ__Brand__44292CC7D22BAC53").IsUnique();

            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.BrandCode).HasMaxLength(36);
            entity.Property(e => e.BrandName).HasMaxLength(100);
            entity.Property(e => e.ImageName).HasMaxLength(100);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Brands)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Brand__UserID__4CA06362");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__19093A2B44D0EF3A");

            entity.ToTable("Category");

            entity.HasIndex(e => e.CategoryCode, "UQ__Category__371BA95589EC0488").IsUnique();

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.CategoryCode).HasMaxLength(36);
            entity.Property(e => e.CategoryName).HasMaxLength(50);

            entity.HasOne(d => d.Brand).WithMany(p => p.Categories)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Category__BrandI__5535A963");
        });

        modelBuilder.Entity<CustomerSegment>(entity =>
        {
            entity.HasKey(e => e.SegmentId).HasName("PK__Customer__C680609B80D9F8F8");

            entity.ToTable("CustomerSegment");

            entity.HasIndex(e => e.SegmentCode, "UQ__Customer__4A834E881CAE091C").IsUnique();

            entity.Property(e => e.SegmentId).HasColumnName("SegmentID");
            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.SegmentCode).HasMaxLength(36);

            entity.HasOne(d => d.Brand).WithMany(p => p.CustomerSegments)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CustomerS__Brand__5CD6CB2B");
        });

        modelBuilder.Entity<CustomerVisit>(entity =>
        {
            entity.HasKey(e => e.CustomerVisitId).HasName("PK__Customer__1DE5EEC199CE4F62");

            entity.ToTable("CustomerVisit");

            entity.Property(e => e.CustomerVisitId).HasColumnName("CustomerVisitID");
            entity.Property(e => e.ImageCustomerName).HasMaxLength(200);
            entity.Property(e => e.SegmentId).HasColumnName("SegmentID");
        });

        modelBuilder.Entity<GroupAttribute>(entity =>
        {
            entity.HasKey(e => e.GroupAttributeId).HasName("PK__GroupAtt__2B6E4566D3349EC8");

            entity.ToTable("GroupAttribute");

            entity.Property(e => e.GroupAttributeId).HasColumnName("GroupAttributeID");
            entity.Property(e => e.GroupAttributeName).HasMaxLength(100);
        });

        modelBuilder.Entity<ListPosition>(entity =>
        {
            entity.HasKey(e => e.ListId).HasName("PK__ListPosi__E3832865A4CE5D35");

            entity.ToTable("ListPosition");

            entity.Property(e => e.ListId).HasColumnName("ListID");
            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.ListCode).HasMaxLength(36);
            entity.Property(e => e.ListName).HasMaxLength(100);
        });

        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasKey(e => e.MenuId).HasName("PK__Menu__C99ED250EE0A9082");

            entity.ToTable("Menu");

            entity.HasIndex(e => e.MenuCode, "UQ__Menu__868A3A73018725C1").IsUnique();

            entity.Property(e => e.MenuId).HasColumnName("MenuID");
            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.MenuCode).HasMaxLength(36);

            entity.HasOne(d => d.Brand).WithMany(p => p.Menus)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Menu__BrandID__6FE99F9F");
        });

        modelBuilder.Entity<MenuList>(entity =>
        {
            entity.HasKey(e => new { e.MenuId, e.ListId }).HasName("PK__MenuList__87A6E0D697AA07A8");

            entity.ToTable("MenuList");

            entity.Property(e => e.MenuId).HasColumnName("MenuID");
            entity.Property(e => e.ListId).HasColumnName("ListID");
            entity.Property(e => e.BrandId).HasColumnName("BrandID");

            entity.HasOne(d => d.List).WithMany(p => p.MenuLists)
                .HasForeignKey(d => d.ListId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MenuList__ListID__73BA3083");

            entity.HasOne(d => d.Menu).WithMany(p => p.MenuLists)
                .HasForeignKey(d => d.MenuId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MenuList__MenuID__72C60C4A");
        });

        modelBuilder.Entity<MenuSegment>(entity =>
        {
            entity.HasKey(e => new { e.MenuId, e.SegmentId }).HasName("PK__MenuSegm__65F6D459FF226751");

            entity.ToTable("MenuSegment");

            entity.Property(e => e.MenuId).HasColumnName("MenuID");
            entity.Property(e => e.SegmentId).HasColumnName("SegmentID");

            entity.HasOne(d => d.Menu).WithMany(p => p.MenuSegments)
                .HasForeignKey(d => d.MenuId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MenuSegme__MenuI__787EE5A0");

            entity.HasOne(d => d.Segment).WithMany(p => p.MenuSegments)
                .HasForeignKey(d => d.SegmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__MenuSegme__Segme__797309D9");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payments__9B556A58C931E728");

            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.PaymentDate).HasColumnType("datetime");
            entity.Property(e => e.TransactionId)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("TransactionID");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Payments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Payments__UserID__3F466844");
        });

        modelBuilder.Entity<Plan>(entity =>
        {
            entity.HasKey(e => e.PlanId).HasName("PK__Plans__755C22D7E014F5D2");

            entity.Property(e => e.PlanId).HasColumnName("PlanID");
            entity.Property(e => e.PlanName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Product__B40CC6EDA6592E6D");

            entity.ToTable("Product");

            entity.HasIndex(e => e.ProductCode, "UQ__Product__2F4E024F651FAE78").IsUnique();

            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.ImageName).HasMaxLength(200);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductCode).HasMaxLength(36);
            entity.Property(e => e.ProductName).HasMaxLength(200);
            entity.Property(e => e.SpotlightVideoImageName)
                .HasMaxLength(200)
                .HasColumnName("SpotlightVideo_ImageName");
            entity.Property(e => e.SpotlightVideoImageUrl).HasColumnName("SpotlightVideo_ImageUrl");

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Product__Categor__59063A47");
        });

        modelBuilder.Entity<ProductList>(entity =>
        {
            entity.HasKey(e => new { e.ProductId, e.ListId }).HasName("PK__ProductL__FA34F46BA6905711");

            entity.ToTable("ProductList");

            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.ListId).HasColumnName("ListID");
            entity.Property(e => e.BrandId).HasColumnName("BrandID");

            entity.HasOne(d => d.List).WithMany(p => p.ProductLists)
                .HasForeignKey(d => d.ListId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductLi__ListI__6C190EBB");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductLists)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductLi__Produ__6B24EA82");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.RefreshTokenId).HasName("PK__RefreshT__F5845E59CE71EE8F");

            entity.ToTable("RefreshToken");

            entity.HasIndex(e => e.RefreshTokenCode, "UQ__RefreshT__5FC549204B0AB2AF").IsUnique();

            entity.Property(e => e.RefreshTokenId).HasColumnName("RefreshTokenID");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.ExpiresAt).HasColumnType("datetime");
            entity.Property(e => e.JwtId)
                .HasMaxLength(150)
                .HasColumnName("JwtID");
            entity.Property(e => e.RefreshTokenCode).HasMaxLength(36);
            entity.Property(e => e.RefreshTokenValue).HasMaxLength(255);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RefreshTo__UserI__48CFD27E");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE3A75666944");

            entity.ToTable("Role");

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Screen>(entity =>
        {
            entity.HasKey(e => e.ScreenId).HasName("PK__Screen__0AB60F85D95F9370");

            entity.ToTable("Screen");

            entity.Property(e => e.ScreenId).HasColumnName("ScreenID");
            entity.Property(e => e.StoreId).HasColumnName("StoreID");

            entity.HasOne(d => d.Store).WithMany(p => p.Screens)
                .HasForeignKey(d => d.StoreId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Screen__StoreID__00200768");
        });

        modelBuilder.Entity<ScreenMenu>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ScreenMenu");

            entity.Property(e => e.MenuId).HasColumnName("MenuID");
            entity.Property(e => e.ScreenId).HasColumnName("ScreenID");

            entity.HasOne(d => d.Menu).WithMany()
                .HasForeignKey(d => d.MenuId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ScreenMen__MenuI__02FC7413");

            entity.HasOne(d => d.Screen).WithMany()
                .HasForeignKey(d => d.ScreenId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ScreenMen__Scree__02084FDA");
        });

        modelBuilder.Entity<SegmentAttribute>(entity =>
        {
            entity.HasKey(e => new { e.SegmentId, e.AttributeId, e.Value }).HasName("PK__SegmentA__B89F2BB8FA893CFB");

            entity.ToTable("SegmentAttribute");

            entity.Property(e => e.SegmentId).HasColumnName("SegmentID");
            entity.Property(e => e.AttributeId).HasColumnName("AttributeID");
            entity.Property(e => e.Value).HasMaxLength(125);
            entity.Property(e => e.BrandId).HasColumnName("BrandID");

            entity.HasOne(d => d.Attribute).WithMany(p => p.SegmentAttributes)
                .HasForeignKey(d => d.AttributeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SegmentAt__Attri__66603565");

            entity.HasOne(d => d.Segment).WithMany(p => p.SegmentAttributes)
                .HasForeignKey(d => d.SegmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SegmentAt__Segme__656C112C");
        });

        modelBuilder.Entity<Store>(entity =>
        {
            entity.HasKey(e => e.StoreId).HasName("PK__Store__3B82F0E128F5FB94");

            entity.ToTable("Store");

            entity.HasIndex(e => e.StoreCode, "UQ__Store__02A384F8C51173F0").IsUnique();

            entity.Property(e => e.StoreId).HasColumnName("StoreID");
            entity.Property(e => e.Address).HasMaxLength(150);
            entity.Property(e => e.BrandId).HasColumnName("BrandID");
            entity.Property(e => e.City).HasMaxLength(150);
            entity.Property(e => e.StoreCode).HasMaxLength(36);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Brand).WithMany(p => p.Stores)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Store__BrandID__5070F446");

            entity.HasOne(d => d.User).WithMany(p => p.Stores)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Store__UserID__5165187F");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.SubscriptionId).HasName("PK__Subscrip__9A2B24BD8D8BAD1E");

            entity.HasIndex(e => e.PaymentId, "UQ__Subscrip__9B556A59049C8C11").IsUnique();

            entity.HasIndex(e => e.SubscriptionCode, "UQ__Subscrip__A940962CD6827D87").IsUnique();

            entity.Property(e => e.SubscriptionId).HasColumnName("SubscriptionID");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.PlanId).HasColumnName("PlanID");
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.SubscriptionCode).HasMaxLength(36);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Payment).WithOne(p => p.Subscription)
                .HasForeignKey<Subscription>(d => d.PaymentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Subscript__Payme__44FF419A");

            entity.HasOne(d => d.Plan).WithMany(p => p.Subscriptions)
                .HasForeignKey(d => d.PlanId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Subscript__PlanI__440B1D61");
        });

        modelBuilder.Entity<VisitAttribute>(entity =>
        {
            entity.HasKey(e => new { e.CustomerVisitId, e.AttributeId }).HasName("PK__VisitAtt__A1FD7C59AF7A525F");

            entity.ToTable("VisitAttribute");

            entity.Property(e => e.CustomerVisitId).HasColumnName("CustomerVisitID");
            entity.Property(e => e.AttributeId).HasColumnName("AttributeID");
            entity.Property(e => e.Value).HasMaxLength(200);

            entity.HasOne(d => d.Attribute).WithMany(p => p.VisitAttributes)
                .HasForeignKey(d => d.AttributeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VisitAttr__Attri__7D439ABD");

            entity.HasOne(d => d.CustomerVisit).WithMany(p => p.VisitAttributes)
                .HasForeignKey(d => d.CustomerVisitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__VisitAttr__Custo__7C4F7684");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
