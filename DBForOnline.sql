CREATE TABLE Role
(
  RoleID INT NOT NULL IDENTITY(1,1),
  RoleName VARCHAR(50) NOT NULL,
  PRIMARY KEY (RoleID)
);

CREATE TABLE AppUser
(
  UserID INT NOT NULL IDENTITY(1,1),
  UserCode NVARCHAR(36) NOT NULL UNIQUE,
  UserName VARCHAR(50) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  RoleID INT NOT NULL,
  CreateDate DATE NOT NULL,
  IsActive BIT NOT NULL,
  Status INT NOT NULL,
  Fullname NVARCHAR(50),
  Phone VARCHAR(12),
  Dob DATE,
  Gender VARCHAR(6),
  UpdateBy INT,
  UpdateDate DATE,
  PRIMARY KEY (UserID),
  FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);

ALTER TABLE AppUser
ALTER COLUMN UserName VARCHAR(50) COLLATE SQL_Latin1_General_CP1_CS_AS;

ALTER TABLE AppUser
ALTER COLUMN Password VARCHAR(255) COLLATE SQL_Latin1_General_CP1_CS_AS;


CREATE TABLE RefreshToken
(
  RefreshTokenID INT NOT NULL IDENTITY(1,1),
  RefreshTokenCode NVARCHAR(36) NOT NULL UNIQUE,
  RefreshTokenValue NVARCHAR(255) NOT NULL,
  UserID INT NOT NULL,
  JwtID NVARCHAR(150) NOT NULL,
  IsUsed BIT NULL,
  IsRevoked BIT NULL,
  ExpiresAt DATETIME NOT NULL,
  CreatedAt DATETIME NOT NULL,
  PRIMARY KEY (RefreshTokenID),
  FOREIGN KEY (UserID) REFERENCES AppUser(UserID)
);

CREATE TABLE Brand
(
  BrandID INT NOT NULL IDENTITY(1,1),
  BrandCode NVARCHAR(36) NOT NULL UNIQUE,
  BrandName NVARCHAR(100) NOT NULL,
  UserID INT NOT NULL,
  CreateDate DATE NOT NULL,
  Status INT NOT NULL,
  ImageUrl NVARCHAR(MAX) NULL,
  ImageName NVARCHAR(100) NULL,
  PRIMARY KEY (BrandID),
  FOREIGN KEY (UserID) REFERENCES AppUser(UserID)
);

CREATE TABLE Store
(
  StoreID INT NOT NULL IDENTITY(1,1),
  StoreCode NVARCHAR(36) NOT NULL UNIQUE,
  UserID INT NOT NULL,
  CreateDate DATE NOT NULL,
  IsActive BIT NOT NULL,
  UpdateDate DATE NULL,
  Status INT NOT NULL,
  Address NVARCHAR(150) NOT NULL,
  City NVARCHAR(150) NOT NULL,
  BrandID INT NOT NULL,
  PRIMARY KEY (StoreID),
  FOREIGN KEY (BrandID) REFERENCES Brand(BrandID),
  FOREIGN KEY (UserID) REFERENCES AppUser(UserID)
);


CREATE TABLE Category
(
  CategoryID INT NOT NULL IDENTITY(1,1),
  CategoryCode NVARCHAR(36) NOT NULL UNIQUE,
  CategoryName NVARCHAR(50) NOT NULL,
  CreateDate DATE NOT NULL,
  UpdateDate DATE NULL,
  Status INT NOT NULL,
  BrandID INT NOT NULL,
  PRIMARY KEY (CategoryID),
  FOREIGN KEY (BrandID) REFERENCES Brand(BrandID)
);

CREATE TABLE Product
(
  ProductID INT NOT NULL IDENTITY(1,1),
  ProductCode NVARCHAR(36) NOT NULL UNIQUE,
  CreateDate DATE NOT NULL,
  ProductName NVARCHAR(200) NOT NULL,
  SpotlightVideo_ImageUrl NVARCHAR(MAX) NULL,
  SpotlightVideo_ImageName NVARCHAR(200) NULL,
  ImageUrl NVARCHAR(MAX) NULL,
  ImageName NVARCHAR(200) NULL,
  Description NVARCHAR(MAX) NULL,
  CategoryID INT NOT NULL,
  BrandID INT NOT NULL,
  Price DECIMAL(18, 2) ,
  PRIMARY KEY (ProductID),
  FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID),
);

CREATE TABLE CustomerSegment
(
  SegmentID INT NOT NULL IDENTITY(1,1),
  SegmentCode NVARCHAR(36) NOT NULL UNIQUE,
  SegmentName NVARCHAR(MAX) NOT NULL,
  Demographics NVARCHAR(MAX) NOT NULL,
  CreateDate DATE NOT NULL,
  UpdateDate DATE NULL,
  Status INT NOT NULL,
  BrandID INT NOT NULL
  PRIMARY KEY (SegmentID),
  FOREIGN KEY (BrandID) REFERENCES Brand(BrandID),
);

CREATE TABLE GroupAttribute
(
  GroupAttributeID INT NOT NULL IDENTITY(1,1),
  GroupAttributeName NVARCHAR(100) NOT NULL,
  CreateDate DATE NOT NULL,
  PRIMARY KEY (GroupAttributeID)
);

CREATE TABLE Attribute
(
  AttributeID INT NOT NULL IDENTITY(1,1),
  AttributeCode NVARCHAR(36) NOT NULL UNIQUE,
  AttributeName NVARCHAR(100) NOT NULL,
  Description NVARCHAR(MAX) NULL,
  Status INT NOT NULL,
  CreateDate DATE NOT NULL,
  UpdateDate DATE NULL,
  GroupAttributeID INT NOT NULL,
  PRIMARY KEY (AttributeID),
  FOREIGN KEY (GroupAttributeID) REFERENCES GroupAttribute(GroupAttributeID)
);

CREATE TABLE SegmentAttribute
(
  SegmentID INT NOT NULL,
  AttributeID INT NOT NULL,
  Value NVARCHAR(125) NOT NULL,
  BrandID INT NULL,
  PRIMARY KEY (SegmentID, AttributeID, Value),
  FOREIGN KEY (SegmentID) REFERENCES CustomerSegment(SegmentID),
  FOREIGN KEY (AttributeID) REFERENCES Attribute(AttributeID)
);

Create Table ListPosition(
ListID INT NOT NULL IDENTITY(1,1),
ListCode NVARCHAR(36) NOT NULL,
TotalProduct INT NULL,
CreateDate DATE NOT NULL,
BrandID INT NOT NULL,
ListName NVARCHAR(100), 
PRIMARY KEY (ListID),
);

CREATE TABLE ProductList
(
  ProductID INT NOT NULL,
  ListID INT NOT NULL,
  --Price INT NOT NULL,
  IndexInList INT NOT NULL,
  BrandID INT NOT NULL,
  PRIMARY KEY (ProductID, ListID),
  FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
  FOREIGN KEY (ListID) REFERENCES ListPosition(ListID)
);



CREATE TABLE Menu
(
  MenuID INT NOT NULL IDENTITY(1,1),
  MenuCode NVARCHAR(36) NOT NULL UNIQUE,
  CreateDate DATE NOT NULL,
  IsActive BIT NOT NULL,
  MenuImage NVARCHAR(MAX) NULL,
  Description NVARCHAR(MAX) NULL,
  Priority INT NULL,
  BrandID INT NOT NULL,
  PRIMARY KEY (MenuID),
  FOREIGN KEY (BrandID) REFERENCES Brand(BrandID)
);

CREATE TABLE MenuList
(
  MenuID INT NOT NULL,
  ListID INT NOT NULL,
  ListIndex INT NOT NULL,
  BrandID INT NOT NULL,
  PRIMARY KEY (MenuID, ListID),
  FOREIGN KEY (MenuID) REFERENCES Menu(MenuID),
  FOREIGN KEY (ListID) REFERENCES ListPosition(ListID)
);

CREATE TABLE CustomerVisit
(
  CustomerVisitID INT NOT NULL IDENTITY(1,1),
  ImageCustomerUrl NVARCHAR(MAX) NOT NULL,
  ImageCustomerName NVARCHAR(200) NOT NULL,
  CreateDate DATE NOT NULL,
  SegmentID INT NULL,
  PRIMARY KEY (CustomerVisitID),
);

CREATE TABLE MenuSegment
(
  Priority INT NOT NULL,
  MenuID INT NOT NULL,
  SegmentID INT NOT NULL,
  PRIMARY KEY (MenuID, SegmentID),
  FOREIGN KEY (MenuID) REFERENCES Menu(MenuID),
  FOREIGN KEY (SegmentID) REFERENCES CustomerSegment(SegmentID)
);

CREATE TABLE VisitAttribute
(
  CustomerVisitID INT NOT NULL,
  AttributeID INT NOT NULL,
  Value NVARCHAR(200) NOT NULL,
  PRIMARY KEY (CustomerVisitID, AttributeID),
  FOREIGN KEY (CustomerVisitID) REFERENCES CustomerVisit(CustomerVisitID),
  FOREIGN KEY (AttributeID) REFERENCES Attribute(AttributeID)
);

CREATE TABLE Screen
(
  ScreenID INT NOT NULL IDENTITY(1,1),
  StoreID INT NOT NULL,
  PRIMARY KEY (ScreenID),
  FOREIGN KEY (StoreID) REFERENCES Store(StoreID)
);

CREATE TABLE ScreenMenu
(
  FromTime DATE NOT NULL,
  ToTime DATE NOT NULL,
  Status INT NOT NULL,
  ScreenID INT NOT NULL,
  MenuID INT NOT NULL,
  FOREIGN KEY (ScreenID) REFERENCES Screen(ScreenID),
  FOREIGN KEY (MenuID) REFERENCES Menu(MenuID)
);

-- thông tin ảo cho appUser

-- Thông tin ảo cho bảng Role
INSERT INTO Role (RoleName) VALUES ('Admin');
INSERT INTO Role (RoleName) VALUES ('Brand Manager');
INSERT INTO Role (RoleName) VALUES ('Branch Manager');


-- Thông tin ảo cho bảng AppUser
INSERT INTO AppUser (UserCode, UserName, Password, RoleID, CreateDate, IsActive, Status, Fullname, Phone, Dob, Gender, UpdateBy, UpdateDate) VALUES 
('9e2a9c0a-3f94-4b6a-8ef2-123456789012', 'admin', 'YeE2JKedsIRzqg6yRuJXIw==', 1, '2024-01-01', 1, 1, 'Admin User', '1234567890', '1970-01-01', 'Male', '1', '2024-01-01'),
('e3c3d1f1-8b8f-4b6a-bc2e-234567890123', 'brand manager', 'YeE2JKedsIRzqg6yRuJXIw==', 2, '2024-01-02', 1, 1, 'Brand Manager One', '1234567891', '1980-01-01', 'Female', '1', '2024-01-02'),
('f3a5c4d7-9d8e-4e4b-bd3f-345678901234', 'brand manager', 'YeE2JKedsIRzqg6yRuJXIw==', 2, '2024-01-03', 1, 1, 'Brand Manager Two', '1234567892', '1981-01-01', 'Male', '1', '2024-01-03'),
('d6e6f7c5-6e7a-4e9b-af4d-456789012345', 'brand manager', 'YeE2JKedsIRzqg6yRuJXIw==', 2, '2024-01-04', 1, 1, 'Brand Manager Three', '1234567893', '1982-01-01', 'Female', '1', '2024-01-04'),
('bed48823-e8ce-4ab6-b214-80ca034fefd0', 'Desmond', 'YeE2JKedsIRzqg6yRuJXIw==', 1, '2024-04-09', 1, 1, 'Desmond Tutu', '1234567894', '1990-04-09', 'Male', '1', '2024-04-09'),
('02eab8bf-add5-4a44-a283-d143fcea2e37', 'Yovonnda', 'YeE2JKedsIRzqg6yRuJXIw==', 2, '2024-02-29', 1, 1, 'Yovonnda Alexis', '1234567895', '1989-02-28', 'Female', '1', '2024-02-29'),
('6ae6ed51-bcff-4aeb-b6af-c6c6d4007ffd', 'Tomlin', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2024-04-24', 1, 1, 'Tomlin Cruz', '1234567896', '1992-04-24', 'Male', '1', '2024-04-24'),
('ce064125-f8fb-4247-86ee-3d63e3111b03', 'Bogart', 'YeE2JKedsIRzqg6yRuJXIw==', 2, '2023-08-31', 1, 1, 'Bogart King', '1234567897', '1988-08-31', 'Male', '1', '2023-08-31'),
('b4286bcf-8b6f-4449-85e8-05e0f4920202', 'Claudius', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2024-03-31', 1, 1, 'Claudius Stone', '1234567898', '1991-03-31', 'Male', '1', '2024-03-31'),
('91115ec9-4190-41ba-97b5-ea0b7da73c05', 'Ethan', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2023-09-01', 1, 1, 'Ethan Hunt', '1234567899', '1990-09-01', 'Male', '1', '2023-09-01'),
('d88a3a67-9bf8-4a5c-9aa9-567ff46d4879', 'Audy', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2024-03-01', 1, 1, 'Audy Brown', '1234567800', '1991-03-01', 'Female', '1', '2024-03-01'),
('c3bb300a-f1fe-4cad-886a-65530e484394', 'Joey', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2023-10-04', 1, 1, 'Joey Tribbiani', '1234567801', '1988-10-04', 'Male', '1', '2023-10-04'),
('1601e8e8-8b63-4058-9789-e673d5de548f', 'Heinrick', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2023-07-22', 1, 1, 'Heinrick Muller', '1234567802', '1987-07-22', 'Male', '1', '2023-07-22'),
('9d9749ed-d2cc-44ac-b661-cea513e15ee5', 'Wilbert', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2023-11-22', 1, 1, 'Wilbert Smith', '1234567803', '1989-11-22', 'Male', '1', '2023-11-22'),
('1df2d80a-c01a-447a-985a-e96590184c22', 'Birgitta', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2024-04-15', 1, 1, 'Birgitta Johnson', '1234567804', '1990-04-15', 'Female', '1', '2024-04-15'),
('eec2f545-7dc0-4e7f-b74c-be69beb900eb', 'Bent', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2023-11-15', 1, 1, 'Bent Pearson', '1234567805', '1989-11-15', 'Male', '1', '2023-11-15'),
('bf6b881b-d930-4feb-aad5-354075dc959c', 'Ira', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2024-04-20', 1, 1, 'Ira Kaplan', '1234567806', '1988-04-20', 'Male', '1', '2024-04-20'),
('491196fc-ff18-43e7-a831-d3066ae508ab', 'Husein', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2024-02-23', 1, 1, 'Husein Al-Amir', '1234567807', '1987-02-23', 'Male', '1', '2024-02-23'),
('e506d7fa-be8d-44cb-88c3-5e292572c32f', 'Jasun', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2024-03-26', 1, 1, 'Jasun Morrow', '1234567808', '1990-03-26', 'Male', '1', '2024-03-26'),
('2c2e613d-3753-449e-9744-16369b2ff0c2', 'Perceval', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2023-10-11', 1, 1, 'Perceval Knight', '1234567809', '1988-10-11', 'Male', '1', '2023-10-11'),
('95a2e6b3-4827-40a5-9d96-89faf5025e38', 'Abramo', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2023-06-21', 1, 1, 'Abramo Villa', '1234567810', '1987-06-21', 'Male', '1', '2023-06-21'),
('bdb28209-13c4-4de2-b77f-b36a54891210', 'Misty', 'YeE2JKedsIRzqg6yRuJXIw==', 3, '2024-05-10', 1, 1, 'Misty Green', '1234567811', '1991-05-10', 'Female', '1', '2024-05-10'),
('b0dea5a7-cd92-43f5-9a37-8ef1af0a6982', 'PhucLongSmartMenu', 'YeE2JKedsIRzqg6yRuJXIw==', 2, '2023-06-14', 1, 1, 'Quang Dũng', '0961287614', '1987-06-14', 'Male', '1', '2023-06-14'),
('005436bb-f7d8-43ad-bd71-cf2f3b429392', 'HighlandsSmartMenu', 'YeE2JKedsIRzqg6yRuJXIw==', 2, '2023-06-20', 1, 1, 'Quang Dũng', '0961287612', '1988-06-20', 'Male', '1', '2023-06-20');



-- Thông tin ảo cho bảng Brand
GO
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( '2fe9bddd-e3c9-4497-a7b2-a0bccb60b085', 'Midel', 11, '12/9/2023', 0);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( '97ad401e-98d4-4a4b-b449-7c757af35d7a', 'Topicstorm', 11, '10/2/2023', 2);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( '4c06b1ea-0c50-4c35-a7ac-8e42c2d96a0f', 'Jetwire', 6, '3/10/2024', 2);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( '4f751b0b-4baa-4cbe-8574-4af6fe23f9c5', 'Yamia', 2, '8/29/2023', 2);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( '9b703985-e994-4230-9d5e-db388731396e', 'Npath', 4, '6/13/2023', 1);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( 'bfa1fdd1-5809-4ab1-aa6b-10ea3809369a', 'Pixoboo', 2, '9/22/2023', 1);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( '8623423b-a1a8-4778-b713-3b84d96340bb', 'Youopia', 12, '7/26/2023', 0);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( '4cbe3327-7a8a-4530-a27e-da21c1097dc1', 'Avavee', 12, '1/30/2024', 2);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( 'd629fce0-711d-43b1-85d5-92e53d34ab13', 'Skidoo', 9, '10/5/2023', 2);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( 'bbe90835-236d-47be-97c1-1f4bbe4c2dcd', 'Wordtune', 11, '6/16/2023', 2);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( '1652201e-10c5-4ef9-a520-5986ca4a4100', 'Flipbug', 7, '8/2/2023', 1);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( 'b2dc03e3-08ae-48d4-aa6b-eab6c1aec684', 'Kazu', 10, '5/13/2024', 0);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( '96f7a8e0-b426-48b7-9cfe-09266dad94b7', 'Teklist', 7, '10/15/2023', 2);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( 'a0030b9c-c86d-4625-9904-f6ee19e51b46', 'Rhyloo', 5, '4/28/2024', 1);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( 'addd2532-96d8-41d4-95b2-332035616c85', 'Trilia', 7, '2/29/2024', 2);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( 'edbf2901-5130-4fd4-a811-3bfd36a6d8a7', 'Aibox', 18, '8/23/2023', 0);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status) values ( 'd07bd21f-2ca8-4772-95ef-b88d2f0f6668', 'Quamba', 5, '11/30/2023', 1);
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status, ImageUrl) values ( 'a2100d43-bac6-4330-ad90-4ba0321ee807', 'The Coffee House', 9, '1/23/2024', 1, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/brands/thecoffeehouse.png');
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status, ImageUrl) values ( 'b0d36a44-45b7-40aa-a0f8-cb945eacfd6b', 'Viva', 20, '9/22/2023', 1, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/brands/viva.png');
insert into Brand ( BrandCode, BrandName, UserID, CreateDate, Status, ImageUrl) values ( '07e2e547-6763-4e95-8d44-10ffd019ae3d', 'Trung Nguyên Legend', 14, '2/23/2024', 1, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/brands/trungnguyen.png');
INSERT INTO Brand (BrandCode, BrandName, UserID, CreateDate, Status, ImageUrl, ImageName) VALUES 
('b1234567-89ab-cdef-0123-456789abcdef', N'Phúc Long', 23, '2024-02-01', 1, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/brands/phuclong.png', NULL),
('c2345678-9abc-def0-1234-56789abcdef0', N'Cộng', 3, '2024-02-02', 1, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/brands/Cong.png', NULL),
('d3456789-abcd-ef01-2345-6789abcdef01', N'Highlands', 24, '2024-02-03', 1, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/brands/highlands.png', NULL);
GO

-- Category
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '93763006-2814-48c2-83e8-95717b4f4860', 'Drywall & Acoustical (FED)', '3/5/2024', '7/28/2023', 2, 10);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '8bcf23e6-7d82-4a66-8034-1fe884401475', 'Retaining Wall and Brick Pavers', '11/26/2023', '7/6/2023', 0, 14);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( 'a725d801-aa4d-497f-9b4d-e843d07af2ef', 'Granite Surfaces', '10/19/2023', '12/3/2023', 0, 12);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ('e23dd68f-d9a9-41db-8b61-3e2a407a4029', 'Marlite Panels (FED)', '12/8/2023', '3/26/2024', 2, 14);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( 'df96f303-4b98-4c00-87f8-aac0c5515251', 'Roofing (Metal)', '11/25/2023', '6/9/2023', 0, 9);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( 'd39030b3-6e13-4ca1-9ae3-83b1b381d1f9', 'Masonry', '4/22/2024', '10/2/2023', 2, 3);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '114b10f0-4901-4463-9470-d38af73e2930', 'Overhead Doors', '8/21/2023', '2/15/2024', 1, 5);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( 'ad8c2c90-d367-49e3-ac09-f5ef59cc65f2', 'Painting & Vinyl Wall Covering', '11/18/2023', '10/31/2023', 0, 21);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( 'e50bf864-02b7-47d2-9785-93b07c16753f', 'Landscaping & Irrigation', '7/12/2023', '3/15/2024', 0, 9);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '99d27e4f-8c1c-424a-9df4-831d656fc6bb', 'Structural & Misc Steel Erection', '4/12/2024', '11/25/2023', 1, 16);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '1971fa1d-df64-4783-b77f-89fcba38b7b8', 'Structural and Misc Steel (Fabrication)', '9/3/2023', '8/15/2023', 2, 6);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '51f47ac2-bc4e-4678-8b4c-dce5c3005da4', 'RF Shielding', '10/13/2023', '6/4/2023', 0, 6);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( 'eadfbec1-d069-48e6-9f4e-6693f252461e', 'Asphalt Paving', '8/23/2023', '6/6/2023', 2, 6);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '0e5b65cf-81e7-4b37-8750-839b83f1ae5e', 'Fire Sprinkler System', '8/2/2023', '5/16/2024', 2, 16);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '0d285210-d7ea-47fd-aa11-7f8a9de0b6a1', 'Drywall & Acoustical (MOB)', '2/21/2024', '8/6/2023', 2, 13);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '109eb85f-91a4-46cf-8358-3b2f23a2b3aa', 'Retaining Wall and Brick Pavers', '2/17/2024', '4/14/2024', 2, 5);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '15ee1124-e23d-4680-baee-60a20d51e6f5', 'Sitework & Site Utilities', '1/6/2024', '10/23/2023', 2, 16);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( 'db42fda6-90ff-46df-b925-258245579489', 'Site Furnishings', '2/13/2024', '8/19/2023', 2, 5);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( 'cb208972-387c-4603-93f5-70640e1e690b', 'Electrical', '2/20/2024', '2/6/2024', 0, 14);
insert into Category ( CategoryCode, CategoryName, UpdateDate, CreateDate, Status, BrandID) values ( '158c8d16-d89b-4eac-b81a-b86b2ddaf79b', 'Elevator', '8/21/2023', '5/26/2024', 2, 6);

-- Store
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'b6421dde-9a83-46bb-9d12-9042bf3b90e4', 0, 11, '4/2/2024', 1, '12th Floor', 'San Sebastian', 20);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( '79444be1-53d2-419a-8a3b-cbdc77dec805', 0, 15, '8/4/2023', 0, 'Room 1241', 'Tyre', 7);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'e6280ceb-5689-409f-9efc-3caefbbba3cd', 0, 18, '9/22/2023', 2, 'Apt 1728', 'Henggouqiao', 8);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( '3353e09e-10a2-4ce7-9b22-539c837cf682', 1, 10, '11/27/2023', 1, '17th Floor', 'Dengyue', 10);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( '0d67e41b-935c-4163-a705-8c70ae43417b', 0, 11, '9/4/2023', 1, 'PO Box 42984', 'Gamawa', 7);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'deb32d2b-04e3-4ab1-b8b1-ec533f9af4b0', 0, 8, '7/6/2023', 0, 'Suite 36', 'Tangfang', 16);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( '670d5660-0cbd-462d-a368-2fd86239f2f4', 1, 3, '6/12/2023', 1, 'Room 71', 'Saint-Rémi', 16);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( '32046c2e-8ac3-4d90-871e-81398c885747', 0, 4, '2/20/2024', 0, 'Room 567', 'Sedandang', 2);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'dc636ec2-1806-4089-8cb1-919977a3f491', 1, 9, '9/21/2023', 1, 'Apt 1748', 'Eldama Ravine', 14);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'a0850f60-14c9-42b7-b4c2-38df43ffc178', 0, 12, '1/13/2024', 1, 'Room 445', 'Şūrān', 2);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'b5cf6255-907a-433d-bdac-cb7e0a9915b7', 1, 14, '2/22/2024', 2, 'Apt 1301', 'San Bernardo', 5);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'c5efbf51-d3bf-4049-89ff-cfb68d82152c', 1, 12, '7/9/2023', 2, 'Apt 511', 'Sapareva Banya', 6);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( '9447c085-d790-4837-a791-dd2fa67f3648', 1, 16, '11/1/2023', 0, 'Apt 685', 'Bayawan', 19);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( '18b1743a-0c43-41a9-9443-b9e758aa0fad', 0, 1, '1/29/2024', 2, '15th Floor', 'Valencia', 9);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( '2e78c582-0e80-4b6d-bdf2-e9436df0e923', 0, 12, '4/26/2024', 1, 'Suite 38', 'Pengilon', 12);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'a7bef7c7-a5fe-48d7-8eca-a60d44449328', 0, 19, '7/13/2023', 2, 'Apt 1370', 'Draginje', 16);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( '7759e5a5-b337-4516-827b-9791a2db4ee9', 0, 7, '2/4/2024', 1, 'PO Box 57523', 'Phú Thái', 3);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'c9abf845-9147-4493-ab54-ab0cae463fd9', 1, 1, '12/7/2023', 0, 'PO Box 37989', 'Nizhnedevitsk', 7);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'b5e480b0-25c2-4fea-b191-96416eb4a046', 1, 7, '2/4/2024', 1, '17th Floor', 'Zapatero', 13);
insert into Store ( StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID) values ( 'e5ac02d8-b540-4641-aedb-269d6d4fd10a', 0, 18, '7/30/2023', 2, '1st Floor', 'Jiangnan', 6);

-- Thêm cửa hàng cho thương hiệu có tên 'Phúc Long'
INSERT INTO Store (StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID)
VALUES 
('c5821d44-972e-44f2-84df-69ad5a24cb78', 1, 2, '2024-02-02', 1, N'Số 5, ngõ 30 Tạ Quang Bửu, Phường Bách Khoa, Quận Hai Bà Trưng', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('7a1b7d9c-8b46-45b1-a4e2-e94027f4b422', 1, 2, '2024-02-02', 1, N'Đường 3 Tháng 2. Số 1213 Đường 3 Tháng 2, Phường 6, Quận 11', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('7f90d5e9-9e8d-4df7-9fe0-f88a69d62555', 1, 2, '2024-02-02', 1, N'Tầng 2, LOTTE Mart, 6 Nại Nam, Phường Hòa Cường Bắc, Quận Hải Châu', N'Đà Nẵng', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('8ff1789e-7de2-4dc5-8d64-c349cf82c8f2', 1, 2, '2024-02-02', 1, N' 200 Văn Cao, Phường Đằng Giang, Quận Ngô Quyền', N'Hải Phòng', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('68de7ec3-3c57-4876-bdbd-030ffaa3f5cc', 1, 2, '2024-02-02', 1, N'384 Đường 30 tháng 4, Phường Hưng Lợi, Quận Ninh Kiều', N'Cần Thơ', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long'));
INSERT INTO Store (StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID)
VALUES 
('d4f27f8e-1234-4bcb-8d88-96b8673bdf12', 1, 2, '2024-02-02', 1, N'25 Hàng Gai, Phường Hàng Gai, Quận Hoàn Kiếm', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('4e239f4b-3456-4f29-9d43-b7c912e8a657', 1, 2, '2024-02-02', 1, N'15 Cầu Gỗ, Phường Hàng Bạc, Quận Hoàn Kiếm', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('5f493b7e-5678-4a22-8f9d-81bde64f9e43', 1, 2, '2024-02-02', 1, N'193 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('a6f73b9a-7890-4c67-8c9f-95d8973b7f2d', 1, 2, '2024-02-02', 1, N'35 Hồ Tùng Mậu, Phường Mai Dịch, Quận Cầu Giấy', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('b7e93d6e-9012-4d56-8d9a-24b7f1e8b6d3', 1, 2, '2024-02-02', 1, N'120 Trần Duy Hưng, Phường Trung Hòa, Quận Cầu Giấy', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('c8f27d9f-1234-4b3b-8d6d-36c7e8f8b7a4', 1, 2, '2024-02-02', 1, N'18 Lê Lợi, Phường Bến Nghé, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('d9f57e7c-3456-4e12-9d9e-47d9e8b9f7a5', 1, 2, '2024-02-02', 1, N'35 Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('e0f68e5d-5678-4a2a-8e7a-57e8f8b8f6b6', 1, 2, '2024-02-02', 1, N'45 Lê Lợi, Phường Bến Nghé, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('f1e79d8e-7890-4d4c-8c4a-68e7f8f9f5b7', 1, 2, '2024-02-02', 1, N'12 Trần Hưng Đạo, Phường Bến Thành, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long')),
('02e89f4b-9012-4d5b-8d2d-79e8f9b8f3a8', 1, 2, '2024-02-02', 1, N'56 Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = 'Phúc Long'));

-- Thêm cửa hàng cho thương hiệu có tên 'Highlands'
INSERT INTO Store (StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID)
VALUES 
('1f79779c-85cf-4d0b-b5b6-29d0380a8ff9', 1, 4, '2024-02-03', 1, N'Tầng 5, Vincom Center, Phường Bến Nghé, Quận 1', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('a97b6a5f-3b46-4e2f-86e4-dc74a07775a4', 1, 4, '2024-02-03', 1, N'Tầng 7, Diamond Plaza, Phường Bến Nghé, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('6d3cb5fb-f15f-4686-89e3-7a39c4b735f5', 1, 4, '2024-02-03', 1, N'Phòng 243, Indochina Riverside Towers, Phường Hải Châu 1, Quận Hải Châu', N'Đà Nẵng', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('950f4e6b-2fa9-45c5-89a5-0262b83e6e7a', 1, 4, '2024-02-03', 1, N'Căn hộ 1842, TD Plaza, Phường Đông Khê, Quận Ngô Quyền', N'Hải Phòng', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('44ac3b1e-7b6e-494a-8a06-0aefdcdd7a8d', 1, 4, '2024-02-03', 1, N'Tầng 2, Vincom Plaza Xuân Khánh, Phường Xuân Khánh, Quận Ninh Kiều', N'Cần Thơ', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('e7f2299a-1a2c-4d49-8a9b-0b4f8675a61f', 1, 4, '2024-02-03', 1, N'Số 15, Phố Cửa Nam, Phường Cửa Nam, Quận Hoàn Kiếm', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('f4e9a8a5-34bd-4a1f-8b4c-2a1b4b7d2a1d', 1, 4, '2024-02-03', 1, N'Số 200, Đường Nguyễn Trãi, Phường Thượng Đình, Quận Thanh Xuân', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('a6f2b8c4-89da-4f67-8a3b-3b5d8b9f9d4c', 1, 4, '2024-02-03', 1, N'Số 125, Đường Xuân Thủy, Phường Dịch Vọng Hậu, Quận Cầu Giấy', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('b7d4e8d2-45bc-4a1d-8a1b-4a1d8b5d2a3f', 1, 4, '2024-02-03', 1, N'Số 45, Đường Lê Lợi, Phường Bến Thành, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('c8f5b7e3-56dc-4c1b-8b2d-5b6d8c7d3a5e', 1, 4, '2024-02-03', 1, N'Số 100, Đường Điện Biên Phủ, Phường Đa Kao, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('d9e6a9f4-67bc-4a2d-8b3c-6b7d8c8d4a6f', 1, 4, '2024-02-03', 1, N'Số 250, Đường Nguyễn Văn Cừ, Phường An Hòa, Quận Ninh Kiều', N'Cần Thơ', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('e0f7c9a5-78cd-4c2e-8b4d-7c8d8c9d5a7f', 1, 4, '2024-02-03', 1, N'Số 75, Đường Hùng Vương, Phường Hải Châu 1, Quận Hải Châu', N'Đà Nẵng', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('f1e8a9c6-89de-4c3f-8b5e-8d9d8d9e6a8f', 1, 4, '2024-02-03', 1, N'Số 50, Đường Trần Phú, Phường Lộc Thọ, Quận Nha Trang', N'Khánh Hòa', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('02e9b9d7-9ade-4c4f-8b6f-9e9d9d0f7a9f', 1, 4, '2024-02-03', 1, N'Số 135, Đường Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu', N'Đà Nẵng', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands')),
('13e0c9e8-abcd-4d5f-8b7f-a0f9d0f8b8a9', 1, 4, '2024-02-03', 1, N'Số 180, Đường Lý Thường Kiệt, Phường 14, Quận 10', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = 'Highlands'));

-- Thêm cửa hàng cho thương hiệu có tên 'Midel'
INSERT INTO Store (StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID)
VALUES 
('243af059-61e1-4fa0-9eb8-fd1af35815af', 1, 11, '2023-12-09', 0, '8th Floor', 'Hanoi', (SELECT BrandID FROM Brand WHERE BrandName = 'Midel')),
('ca0e69bb-3c5b-49fc-b47b-b4b9a6143809', 1, 11, '2023-12-09', 0, '10th Floor', 'Ho Chi Minh City', (SELECT BrandID FROM Brand WHERE BrandName = 'Midel')),
('63dfcb90-b9a1-4fcf-bae7-0378a469f92d', 1, 11, '2023-12-09', 0, 'Room 385', 'Da Nang', (SELECT BrandID FROM Brand WHERE BrandName = 'Midel')),
('d22af86f-15d3-45e8-95ae-b9641e68d067', 1, 11, '2023-12-09', 0, 'Apt 1219', 'Hai Phong', (SELECT BrandID FROM Brand WHERE BrandName = 'Midel')),
('40e8f9f3-727d-490e-b994-9775a0e4916c', 1, 11, '2023-12-09', 0, 'Suite 26', 'Can Tho', (SELECT BrandID FROM Brand WHERE BrandName = 'Midel'));

-- Thêm cửa hàng cho thương hiệu có tên 'Topicstorm'
INSERT INTO Store (StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID)
VALUES 
('452e378a-1b8a-4ef7-a2ab-160d00e5b7b1', 1, 11, '2023-10-02', 2, '8th Floor', 'Hanoi', (SELECT BrandID FROM Brand WHERE BrandName = 'Topicstorm')),
('7d9ec6e0-9642-4e2b-9dc7-446ee2de5d72', 1, 11, '2023-10-02', 2, '10th Floor', 'Ho Chi Minh City', (SELECT BrandID FROM Brand WHERE BrandName = 'Topicstorm')),
('6663b922-2f51-4321-a906-5c72bb180eff', 1, 11, '2023-10-02', 2, 'Room 385', 'Da Nang', (SELECT BrandID FROM Brand WHERE BrandName = 'Topicstorm')),
('d8cf4317-1c44-4b79-b1b3-b42f9e121791', 1, 11, '2023-10-02', 2, 'Apt 1219', 'Hai Phong', (SELECT BrandID FROM Brand WHERE BrandName = 'Topicstorm'));

-- Thêm cửa hàng cho thương hiệu có tên 'Jetwire'
INSERT INTO Store (StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID)
VALUES 
('22ec20a4-b89a-45a7-8e95-93d63e734e51', 1, 6, '2024-03-10', 2, '12th Floor', 'Hanoi', (SELECT BrandID FROM Brand WHERE BrandName = 'Jetwire')),
('fe97245a-7c56-4a01-82db-4c3da12e7f4b', 1, 6, '2024-03-10', 2, '15th Floor', 'Ho Chi Minh City', (SELECT BrandID FROM Brand WHERE BrandName = 'Jetwire')),
('6e0da751-52b2-4345-b3ac-bf75e820be9b', 1, 6, '2024-03-10', 2, 'Room 124', 'Da Nang', (SELECT BrandID FROM Brand WHERE BrandName = 'Jetwire')),
('c3d0b0c0-48aa-4382-9c30-b7b9e3ab1530', 1, 6, '2024-03-10', 2, 'Apt 1728', 'Hai Phong', (SELECT BrandID FROM Brand WHERE BrandName = 'Jetwire')),
('4ac6300e-1d08-4a1d-9d57-3d9295eef4d0', 1, 6, '2024-03-10', 2, 'Suite 36', 'Can Tho', (SELECT BrandID FROM Brand WHERE BrandName = 'Jetwire'));

-- Thêm cửa hàng cho thương hiệu có tên 'Yamia'
INSERT INTO Store (StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID)
VALUES 
('5a02d72f-9949-4226-8549-2c57ac9b8439', 1, 2, '2023-08-29', 2, '8th Floor', 'Hanoi', (SELECT BrandID FROM Brand WHERE BrandName = 'Yamia')),
('10a7e196-cf67-408f-a5b7-4a6f3a156d6a', 1, 2, '2023-08-29', 2, '10th Floor', 'Ho Chi Minh City', (SELECT BrandID FROM Brand WHERE BrandName = 'Yamia')),
('c3f274a1-54de-4649-bc16-3f4323c8b93e', 1, 2, '2023-08-29', 2, 'Room 385', 'Da Nang', (SELECT BrandID FROM Brand WHERE BrandName = 'Yamia')),
('f28f4266-d2a9-4f49-8002-5e0c17e621fd', 1, 2, '2023-08-29', 2, 'Apt 1219', 'Hai Phong', (SELECT BrandID FROM Brand WHERE BrandName = 'Yamia')),
('81e03d1f-689a-4379-8eef-00ebbd476a8f', 1, 2, '2023-08-29', 2, 'Suite 26', 'Can Tho', (SELECT BrandID FROM Brand WHERE BrandName = 'Yamia'));

-- Thêm cửa hàng cho thương hiệu có tên 'Npath'
INSERT INTO Store (StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID)
VALUES 
('f79f8c9d-2f77-4b15-a2f5-cf74e5b0364d', 1, 4, '2023-06-13', 1, '12th Floor', 'Hanoi', (SELECT BrandID FROM Brand WHERE BrandName = 'Npath')),
('8fb2e23e-6c8a-48e2-8a2c-cd73f34d298d', 1, 4, '2023-06-13', 1, '15th Floor', 'Ho Chi Minh City', (SELECT BrandID FROM Brand WHERE BrandName = 'Npath')),
('c0d84a1c-b373-4ff4-9b7e-3a845ce06b24', 1, 4, '2023-06-13', 1, 'Room 124', 'Da Nang', (SELECT BrandID FROM Brand WHERE BrandName = 'Npath')),
('87c5cde6-e1c5-441a-a540-641b4d3b5a06', 1, 4, '2023-06-13', 1, 'Apt 1728', 'Hai Phong', (SELECT BrandID FROM Brand WHERE BrandName = 'Npath')),
('7f9bcb64-dad8-4e22-9de8-bb250c2c47cd', 1, 4, '2023-06-13', 1, 'Suite 36', 'Can Tho', (SELECT BrandID FROM Brand WHERE BrandName = 'Npath'));

-- Thêm cửa hàng cho thương hiệu có tên 'Pixoboo'
INSERT INTO Store (StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID)
VALUES 
('cb6a522f-6594-456f-b2b7-e32f2853f7e6', 1, 2, '2023-09-22', 1, '8th Floor', 'Hanoi', (SELECT BrandID FROM Brand WHERE BrandName = 'Pixoboo')),
('5eb0c36c-915a-44f1-83cd-eb9cd1b1073c', 1, 2, '2023-09-22', 1, '10th Floor', 'Ho Chi Minh City', (SELECT BrandID FROM Brand WHERE BrandName = 'Pixoboo')),
('1a16aa15-0666-4345-b249-49f870ec0755', 1, 2, '2023-09-22', 1, 'Room 385', 'Da Nang', (SELECT BrandID FROM Brand WHERE BrandName = 'Pixoboo')),
('f7db4766-cab1-4e79-84f2-3849183285e4', 1, 2, '2023-09-22', 1, 'Apt 1219', 'Hai Phong', (SELECT BrandID FROM Brand WHERE BrandName = 'Pixoboo'));

-- Thêm cửa hàng cho thương hiệu có tên 'Cộng'
INSERT INTO Store (StoreCode, IsActive, UserID, CreateDate, Status, Address, City, BrandID)
VALUES 
('b91c4a27-2915-44c7-b877-20a17442352c', 1, 3, '2024-02-02', 1, N'Tầng 12, Toà nhà Cộng, Phường Cửa Nam, Quận Hoàn Kiếm', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('d1e38f48-ff25-489d-8e0d-0e7bbfbd5f38', 1, 3, '2024-02-02', 1, N'Tầng 15, Toà nhà Cộng, Phường Bến Nghé, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('e7b098e6-fd91-4cb8-8014-c4b4a2268f27', 1, 3, '2024-02-02', 1, N'Phòng 124, Toà nhà Cộng, Phường Hải Châu 1, Quận Hải Châu', N'Đà Nẵng', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('d11c9d53-0547-41ac-96d4-0d6f6a6d2b9e', 1, 3, '2024-02-02', 1, N'Căn hộ 1728, Toà nhà Cộng, Phường Đông Khê, Quận Ngô Quyền', N'Hải Phòng', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('01e4267c-3342-4c95-a63c-69c0ddc80a6f', 1, 3, '2024-02-02', 1, N'Tầng 3, Toà nhà Cộng, Phường Xuân Khánh, Quận Ninh Kiều', N'Cần Thơ', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('3e1a7891-44df-45fc-8b6d-3f7a5d28e7d9', 1, 3, '2024-02-02', 1, N'Số 5, Đường Trần Hưng Đạo, Phường Phan Chu Trinh, Quận Hoàn Kiếm', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('4e2b98a2-55ef-46bc-8c7e-4f8a7d39e8ea', 1, 3, '2024-02-02', 1, N'Số 17, Đường Láng Hạ, Phường Thành Công, Quận Ba Đình', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('5f3ca9b3-66fe-47cd-8d8f-5g9a8d40e9fb', 1, 3, '2024-02-02', 1, N'Số 3, Đường Hoàng Diệu, Phường Quán Thánh, Quận Ba Đình', N'Hà Nội', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('6g4dbac4-77gf-48de-8e9g-6h0b9e51f0gc', 1, 3, '2024-02-02', 1, N'Số 8, Đường Nguyễn Du, Phường Bến Thành, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('7h5ecbd5-88gh-49ef-8f1h-7i1c0f62g1hd', 1, 3, '2024-02-02', 1, N'Số 15, Đường Nguyễn Thái Học, Phường Phạm Ngũ Lão, Quận 1', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('8i6fdce6-99hi-4ag8-9j2i-8j2d1g73i2ie', 1, 3, '2024-02-02', 1, N'Số 4, Đường Hùng Vương, Phường Hải Châu 1, Quận Hải Châu', N'Đà Nẵng', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('9j7gfdg7-10ij-4bh9-9k3j-9k3e2h84j3jf', 1, 3, '2024-02-02', 1, N'Số 25, Đường Lê Duẩn, Phường Thạch Thang, Quận Hải Châu', N'Đà Nẵng', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('0k8hgdh8-21jk-5ci0-0l4k-0l4f3i95k4kg', 1, 3, '2024-02-02', 1, N'Số 7, Đường Trần Phú, Phường Lộc Thọ, Quận Nha Trang', N'Khánh Hòa', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('1l9ihdh9-32kl-6dj1-1m5l-1m5g4j06l5lh', 1, 3, '2024-02-02', 1, N'Số 11, Đường Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu', N'Đà Nẵng', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng')),
('2m0jihj0-43lm-7ek2-2n6m-2n6h5k17m6mi', 1, 3, '2024-02-02', 1, N'Số 19, Đường Hùng Vương, Phường 12, Quận 10', N'Hồ Chí Minh', (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng'));

--Product 
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('c6fffd30-e27f-4a47-9bf2-e77883dec225', 'Magnificent frigate bird', 'Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum.', '8/12/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('71559602-7991-483b-9548-089eaf251578', 'Water monitor', 'Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus.', '7/20/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('2fdcd0aa-e1b2-4d80-8346-1c2192536397', 'Silver gull', 'Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', '6/18/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('179dbce0-fa80-42f9-82ca-0bebf1e4be83', 'American buffalo', 'Proin risus. Praesent lectus.', '1/9/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('0d09d558-1884-40aa-a853-49a170c167dc', 'Levaillant''s barbet', 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.', '10/24/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('518ae116-2af6-439b-9115-6cc8a223f5a8', 'Cormorant, king', 'Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum.', '6/1/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('304cdd70-98d0-456d-ae41-bfd40ea8ac3e', 'Mudskipper (unidentified)', 'Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus.', '3/4/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('1a58feb5-9a19-4b30-a220-cde189547cdf', 'Goose, andean', 'Sed vel enim sit amet nunc viverra dapibus.', '1/23/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('9b12f396-3a5c-4383-a797-63191886f98e', 'Toucan, white-throated', 'Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.', '5/31/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('78881ae9-0db4-4601-a984-561858cfe439', 'Common green iguana', 'Donec vitae nisi.', '6/23/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('7036b51f-e4a5-43ca-8e05-55753cb881a9', 'Skunk, western spotted', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum.', '10/20/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('47a02ccc-9264-4b88-9f55-f6ed3c4d55e4', 'Marshbird, brown and yellow', 'Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.', '5/16/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('92c0fb79-0141-41ea-a4f6-0c479971195c', 'Canadian river otter', 'Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.', '11/5/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('5d13fcf4-b31c-4334-9afd-b66324d3f395', 'Hartebeest, coke''s', 'Vestibulum rutrum rutrum neque.', '6/22/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('b7dc209c-1e3f-4341-9a5e-5508606ef6f2', 'Ring-tailed coatimundi', 'Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc.', '1/4/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('09d58fd3-77ce-4ae3-915c-7737dbc6a8c1', 'Klipspringer', 'Maecenas tincidunt lacus at velit.', '8/31/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('529fe75d-fd5e-4501-aa52-0f60a7cdaf4c', 'Lizard, desert spiny', 'In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.', '8/23/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('3aa0a5d1-de13-4b46-ad42-389519f8d30e', 'Macaw, blue and yellow', 'Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '3/2/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('21c0171a-39b7-4bdd-b1f2-88c8fab60377', 'Spotted-tailed quoll', 'Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', '12/19/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('297b8d10-8344-45d8-a85d-ce6e1466d213', 'Red squirrel', 'Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla.', '12/14/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('8030cae4-c69e-429b-90a3-64dab2986eb5', 'Mynah, common', 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.', '3/14/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('0bc2e654-3cd0-40ef-a9fa-3b3915741287', 'Mexican wolf', 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.', '3/29/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('33ba7949-2f3c-4aea-9e99-d818f0be9ce0', 'Peacock, indian', 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis. Sed ante. Vivamus tortor. Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis.', '2/13/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('34e82a87-c98d-4f28-9cb5-efefc1c06589', 'Savannah deer', 'Aliquam non mauris. Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.', '11/6/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('14713ae8-6c1b-4e7d-b0f3-92a0be9f6cd2', 'Ring-tailed possum', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio.', '8/15/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('8d5fa6b3-2741-41cf-ba22-d2fd1ebee149', 'Black-tailed prairie dog', 'Aliquam non mauris. Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.', '6/12/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('02dea72f-c403-4000-9e3b-d690ce3be7b4', 'Coke''s hartebeest', 'Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla.', '6/25/2023', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('baeea2f4-a07d-4db4-99f1-e5a1d6f309c8', 'Oryx, beisa', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.', '5/12/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('b4a7acdc-8310-4f5d-82f6-4f065c4e953f', 'Bear, sloth', 'Phasellus in felis.', '5/16/2024', 1, 8);
insert into Product (ProductCode, ProductName, Description, CreateDate, BrandID, CategoryID) values ('33e36ee5-25fd-4b51-9f7e-9c6c9c7693b2', 'Blackbird, red-winged', 'Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '2/14/2024', 1, 8);

-- Insert 10 rows of data into the ListPosition table
INSERT INTO ListPosition (ListCode, TotalProduct, CreateDate, BrandID) VALUES
(NEWID(), 10, '2024-01-01', 21),
(NEWID(), 20, '2024-01-02', 21),
(NEWID(), 30, '2024-01-03', 21),
(NEWID(), 15, '2024-01-04', 21),
(NEWID(), 25, '2024-01-05', 1),
(NEWID(), 35, '2024-01-06', 1),
(NEWID(), 5, '2024-01-07', 3),
(NEWID(), 10, '2024-01-08', 3),
(NEWID(), 20, '2024-01-09', 3),
(NEWID(), 30, '2024-01-10', 1);

--Menu
insert into Menu ( MenuCode, CreateDate, IsActive, BrandID) values ( 'bfdd194b-0cd5-4462-914c-fb43dd86d5ec', '1/2/2024', 0, (SELECT BrandID FROM Brand WHERE BrandName = N'Phúc Long'));
insert into Menu ( MenuCode, CreateDate, IsActive, BrandID) values ( 'ce30468f-8d3f-4283-a69b-f4b23f71bc73', '3/25/2024', 1, (SELECT BrandID FROM Brand WHERE BrandName = N'Phúc Long'));
insert into Menu ( MenuCode, CreateDate, IsActive, BrandID) values ( '19e388d2-cdae-4991-a486-62c1f807d95d', '8/14/2023', 1, (SELECT BrandID FROM Brand WHERE BrandName = N'Phúc Long'));
insert into Menu ( MenuCode, CreateDate, IsActive, BrandID) values ( '3f04f7e0-ff88-4f46-8a00-2870e2fb9baf', '4/13/2024', 1, (SELECT BrandID FROM Brand WHERE BrandName = N'Highlands'));
insert into Menu ( MenuCode, CreateDate, IsActive, BrandID) values ( '1d8c44a2-04c0-4215-b368-df7aae1d15de', '8/23/2023', 1, (SELECT BrandID FROM Brand WHERE BrandName = N'Highlands'));
insert into Menu ( MenuCode, CreateDate, IsActive, BrandID) values ( 'b985ad24-24a6-4e4f-b913-de8931f2ea22', '7/10/2023', 1, (SELECT BrandID FROM Brand WHERE BrandName = N'Highlands'));
insert into Menu ( MenuCode, CreateDate, IsActive, BrandID) values ( '992eb6cc-6e43-42d9-9ea9-0f613094f3ec', '10/8/2023', 1, (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng'));
insert into Menu ( MenuCode, CreateDate, IsActive, BrandID) values ( '81bbd1c7-bb39-41c4-a2b5-2b0db6767e6d', '12/26/2023', 0, (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng'));
insert into Menu ( MenuCode, CreateDate, IsActive, BrandID) values ( '3ef4ac78-eed0-4f79-83dd-3b212cd5c1be', '8/18/2023', 0, (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng'));
insert into Menu ( MenuCode, CreateDate, IsActive, BrandID) values ( '56b32ea0-623b-4952-8256-89db4ff94010', '1/29/2024', 1, (SELECT BrandID FROM Brand WHERE BrandName = N'Cộng'));
-- Insert sample data into MenuList table
INSERT INTO MenuList (MenuID, ListID, ListIndex, BrandID) VALUES
(1, 1, 1, 1),
(1, 2, 2, 1),
(2, 3, 1, 1),
(2, 4, 2, 2),
(3, 5, 1, 2),
(3, 6, 2, 2),
(1, 7, 1, 3),
(2, 8, 2, 3),
(3, 9, 1, 3),
(1, 10, 2, 1);

--CustomerSegment
INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc già', N'Male, Morning', '8/17/2023', '3/25/2024', 1, 21); --1--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc già', N'Female, Morning', '8/17/2023', '3/25/2024', 1, 21); --2--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc già', N'Male, Afternoon', '8/17/2023', '3/25/2024', 1, 21); --3--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc già', N'Female, Afternoon', '8/17/2023', '3/25/2024', 1, 21); --4--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc già', N'Male, Evening', '8/17/2023', '3/25/2024', 1, 21); --5--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc già', N'Female, Evening', '8/17/2023', '3/25/2024', 1, 21); --6--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trung niên', N'Male, Morning', '8/17/2023', '3/25/2024', 1, 21); --7--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trung niên', N'Female, Morning', '8/17/2023', '3/25/2024', 1, 21); --8--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trung niên', N'Male, Afternoon', '8/17/2023', '3/25/2024', 1, 21); --9--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trung niên', N'Female, Afternoon', '8/17/2023', '3/25/2024', 1, 21); --10--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trung niên', N'Male, Evening', '8/17/2023', '3/25/2024', 1, 21); --11--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trung niên', N'Female, Evening', '8/17/2023', '3/25/2024', 1, 21); --12--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trẻ', N'Male, Morning', '8/17/2023', '3/25/2024', 1, 21); --13--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trẻ', N'Female, Morning', '8/17/2023', '3/25/2024', 1, 21); --14--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trẻ', N'Male, Afternoon', '8/17/2023', '3/25/2024', 1, 21); --15--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trẻ', N'Female, Afternoon', '8/17/2023', '3/25/2024', 1, 21); --16--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trẻ', N'Male, Evening', '8/17/2023', '3/25/2024', 1, 21); --17--

INSERT INTO CustomerSegment (SegmentCode, SegmentName, Demographics, CreateDate, UpdateDate, Status, BrandID) 
VALUES (NEWID(), N'Phân khúc trẻ', N'Female, Evening', '8/17/2023', '3/25/2024', 1, 21); --18--

					
------------------------------------

--group attribute
insert into GroupAttribute ( GroupAttributeName, CreateDate) values ( N'Trạng thái sinh học', '8/20/2023'); --1--
insert into GroupAttribute ( GroupAttributeName, CreateDate) values ( N'Thời gian', '7/29/2023');--2--


--attribute
insert into Attribute ( AttributeCode, AttributeName, Description, Status, CreateDate, UpdateDate, GroupAttributeID) values ( '1cd81372-e7e9-400a-add8-2cee869324cc', N'Age', N'Độ tuổi', 1, '7/25/2023', '4/3/2024', 1);
insert into Attribute ( AttributeCode, AttributeName, Description, Status, CreateDate, UpdateDate, GroupAttributeID) values ( 'b5b80199-6594-40d2-a013-02d9ff67df0e', N'Gender', N'Giới tính', 1, '8/26/2023', '6/30/2023', 1);
insert into Attribute ( AttributeCode, AttributeName, Description, Status, CreateDate, UpdateDate, GroupAttributeID) values ( '965488d0-c17c-4f75-9d40-c4c9b13bad3e', N'Session', N'Thời gian trong ngày', 1, '7/12/2023', '10/23/2023', 2);


--SegmentAttribute

--Phân khúc già, độ tuổi
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (1, 1, '36-99',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (2, 1, '36-99',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (3, 1, '36-99',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (4, 1, '36-99',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (5, 1, '36-99',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (6, 1, '36-99',21);
--Phân khúc già, giới tính--
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (1, 2, 'Male',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (2, 2, 'Female',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (3, 2, 'Male',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (4, 2, 'Female',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (5, 2, 'Male',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (6, 2, 'Female',21);
--Phân khúc già, thời gian--
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (1, 3, 'Morning',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (2, 3, 'Afternoon',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (3, 3, 'Evening',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (4, 3, 'Morning',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (5, 3, 'Afternoon',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (6, 3, 'Evening',21);

--Phân khúc trung niên, độ tuổi
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (7, 1, '26-35',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (8, 1, '26-35',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (9, 1, '26-35',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (10, 1, '26-35',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (11, 1, '26-35',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (12, 1, '26-35',21);
--Phân khúc trung niên, giới tính--
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (7, 2, 'Male',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (8, 2, 'Female',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (9, 2, 'Male',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (10, 2, 'Female',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (11, 2, 'Male',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (12, 2, 'Female',21);
--Phân khúc trung niên, thời gian--
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (7, 3, 'Morning',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (9, 3, 'Afternoon',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (11, 3, 'Evening',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (8, 3, 'Morning',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (10, 3, 'Afternoon',21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (12, 3, 'Evening',21);

--Phân khúc trẻ, độ tuổi
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (13, 1, '18-25', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (14, 1, '18-25', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (15, 1, '18-25', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (16, 1, '18-25', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (17, 1, '18-25', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (18, 1, '18-25', 21);
--Phân khúc trẻ, giới tính--
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (13, 2, 'Male', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (14, 2, 'Female', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (15, 2, 'Male', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (16, 2, 'Female', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (17, 2, 'Male', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (18, 2, 'Female', 21);
--Phân khúc trẻ, thời gian--
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (13, 3, 'Morning', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (14, 3, 'Afternoon', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (15, 3, 'Evening', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (16, 3, 'Morning', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (17, 3, 'Afternoon', 21);
insert into SegmentAttribute (SegmentID, AttributeID, Value, BrandID) values (18, 3, 'Evening', 21);


--MenuSegment
insert into MenuSegment (Priority, MenuID, SegmentID) values (10, 1, 1);


--Screen
insert into Screen (StoreID) values (2);
insert into Screen ( StoreID) values ( 3);
insert into Screen ( StoreID) values ( 9);
insert into Screen ( StoreID) values ( 4);
insert into Screen ( StoreID) values ( 9);
insert into Screen ( StoreID) values (6);
insert into Screen ( StoreID) values (6);
insert into Screen ( StoreID) values ( 5);
insert into Screen ( StoreID) values ( 1);
insert into Screen ( StoreID) values ( 9);

update AppUser 
set IsActive = 1
where UserCode = '9e2a9c0a-3f94-4b6a-8ef2-123456789012'

-- Tạo các Category cho Phúc Long
INSERT INTO [dbo].[Category] (CategoryCode, CategoryName, CreateDate, UpdateDate, Status, BrandID)
VALUES
(NEWID(), N'Trà Sữa', '2024-07-01', '2024-07-01', 1, (SELECT BrandID FROM [thetam1410_].[dbo].[Brand] WHERE BrandName = N'Phúc Long')),
(NEWID(), N'Cà Phê', '2024-07-01', '2024-07-01', 1, (SELECT BrandID FROM [thetam1410_].[dbo].[Brand] WHERE BrandName = N'Phúc Long')),
(NEWID(), N'Đá xay', '2024-07-01', '2024-07-01', 1, (SELECT BrandID FROM [thetam1410_].[dbo].[Brand] WHERE BrandName = N'Phúc Long')),
(NEWID(), N'Đồ Ăn Nhẹ', '2024-07-01', '2024-07-01', 1, (SELECT BrandID FROM [thetam1410_].[dbo].[Brand] WHERE BrandName = N'Phúc Long')),
(NEWID(), N'Trà', '2024-07-01', '2024-07-01', 1, (SELECT BrandID FROM [thetam1410_].[dbo].[Brand] WHERE BrandName = N'Phúc Long'));

-- Lấy BrandID cho Brand 'Phúc Long'
DECLARE @BrandID INT;
SET @BrandID = (SELECT BrandID FROM [thetam1410_].[dbo].[Brand] WHERE BrandName = N'Phúc Long');
-- Tạo các Product cho từng Category

-- Tạo Product cho Category 'Trà Sữa'
INSERT INTO [dbo].[Product] (ProductCode, CreateDate, ProductName, SpotlightVideo_ImageUrl, SpotlightVideo_ImageName, ImageUrl, ImageName, Description, CategoryID, BrandID, Price)
VALUES
(NEWID(), '2024-07-01', N'Trà Sữa Ô Long', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/52trasuaolong.png', 'trasuaolong.png', N'Oolong Milk Tea', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Trà Sữa' AND BrandID = @BrandID), @BrandID, 25000),
(NEWID(), '2024-07-01', N'Trà Sữa Matcha', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/53trasuamatcha.png', 'trasuamatcha.png', N'Matcha Milk Tea', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Trà Sữa' AND BrandID = @BrandID), @BrandID, 27000),
(NEWID(), '2024-07-01', N'Trà Sữa Mãng Cầu Jelly Dừa Sợi', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/54trasuamangcaujerryduasoi.png', 'trasuamangcaujerryduasoi.png', N'Soursop Jelly Coconut Milk Tea', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Trà Sữa' AND BrandID = @BrandID), @BrandID, 29000),
(NEWID(), '2024-07-01', N'Trà Sữa Nhãn Sen', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/55trasuanhansen.png', 'trasuanhansen.png', N'Longan Lotus Milk Tea', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Trà Sữa' AND BrandID = @BrandID), @BrandID, 26000),
(NEWID(), '2024-07-01', N'Hồng Trà Sữa', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/56hongtrasua.png', 'hongtrasua.png', N'Black Milk Tea', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Trà Sữa' AND BrandID = @BrandID), @BrandID, 30000);

-- Tạo Product cho Category 'Cà Phê'
INSERT INTO [dbo].[Product] (ProductCode, CreateDate, ProductName, SpotlightVideo_ImageUrl, SpotlightVideo_ImageName, ImageUrl, ImageName, Description, CategoryID, BrandID, Price)
VALUES
(NEWID(), '2024-07-01', N'Cà Phê Sữa Đá', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/57caphesuada.png', 'caphesuada.png', N'Milk ice coffe', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Cà Phê' AND BrandID = @BrandID), @BrandID, 30000),
(NEWID(), '2024-07-01', N'Cà Phê Đen', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/58capheden.png', 'capheden.png', N'Black coffee', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Cà Phê' AND BrandID = @BrandID), @BrandID, 35000),
(NEWID(), '2024-07-01', N'Cà Phê Latte', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/59caphelatte.png', 'caphelatte.png', N'Coffee Latte', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Cà Phê' AND BrandID = @BrandID), @BrandID, 31000),
(NEWID(), '2024-07-01', N'Bạc xỉu', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/60bacxiu.png', 'bacxiu.png', N'Faint silver', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Cà Phê' AND BrandID = @BrandID), @BrandID, 34000),
(NEWID(), '2024-07-01', N'Cà Phê Cappuccino', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/61Cappuccino.png', 'Cappuccino.png', N'Cappuccino Coffee', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Cà Phê' AND BrandID = @BrandID), @BrandID, 28000);

-- Tạo Product cho Category 'Đá xay'
INSERT INTO [dbo].[Product] (ProductCode, CreateDate, ProductName, SpotlightVideo_ImageUrl, SpotlightVideo_ImageName, ImageUrl, ImageName, Description, CategoryID, BrandID, Price)
VALUES
(NEWID(), '2024-07-01', N'Chanh Đá Xay', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/62chanhdaxay.png', 'chanhdaxay.png', N'Ice Blended Lemon', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Đá xay' AND BrandID = @BrandID), @BrandID, 29000),
(NEWID(), '2024-07-01', N'Matcha Đá Xay', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/63matchadaxay.png', 'matchadaxay.png', N'Matcha Ice Blended', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Đá xay' AND BrandID = @BrandID), @BrandID, 28000),
(NEWID(), '2024-07-01', N'Oreo Capuchino Đá Xay', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/64oreocappuccinodaxay.png', 'oreocappuccinodaxay.png', N'Oreo Cappuccino Iced Blend', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Đá xay' AND BrandID = @BrandID), @BrandID, 36000),
(NEWID(), '2024-07-01', N'Capuchino Đá Xay', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/65cappucinodaxay.png', 'cappucinodaxay.png', N'Iced Blended Cappuccino', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Đá xay' AND BrandID = @BrandID), @BrandID, 38000),
(NEWID(), '2024-07-01', N'Sữa Chua Phúc Bồn Tử Đác Cam', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/66suachuaphucbontudaccam.png', 'suachuaphucbontudaccam.png', N'Orange Raspberry Yogurt', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Đá xay' AND BrandID = @BrandID), @BrandID, 33000);

-- Tạo Product cho Category 'Đồ Ăn Nhẹ'
INSERT INTO [thetam1410_].[dbo].[Product] (ProductCode, CreateDate, ProductName, SpotlightVideo_ImageUrl, SpotlightVideo_ImageName, ImageUrl, ImageName, Description, CategoryID, BrandID, Price)
VALUES
(NEWID(), '2024-07-01', N'Bánh Mì Phúc Long', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/67banhmiphuclong.png', 'banhmiphuclong.png', N'Phuc Long Bread', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Đồ Ăn Nhẹ' AND BrandID = @BrandID), @BrandID, 29000),
(NEWID(), '2024-07-01', N'Bánh Choco Trà Xanh', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/68Green Tea Choco Cake.png', 'Green Tea Choco Cake.png', N'Green Tea Choco Cake', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Đồ Ăn Nhẹ' AND BrandID = @BrandID), @BrandID, 24000),
(NEWID(), '2024-07-01', N'Passion Panna Cotta', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/69Passion Panna Cotta.png', 'Passion Panna Cotta.png', N'Passion Panna Cotta', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Đồ Ăn Nhẹ' AND BrandID = @BrandID), @BrandID, 35000),
(NEWID(), '2024-07-01', N'Tiramisu nhỏ', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/70Tiramisu Mini.png', 'Tiramisu Mini.png', N'Tiramisu mini', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Đồ Ăn Nhẹ' AND BrandID = @BrandID), @BrandID, 31000),
(NEWID(), '2024-07-01', N'Butter Chocolate Croissant 30g', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/71Butter Chocolate Croissant 30g.jpg', 'Butter Chocolate Croissant 30g.jpg', N'utter Chocolate Croissant 30g', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Đồ Ăn Nhẹ' AND BrandID = @BrandID), @BrandID, 30000);

-- Tạo Product cho Category 'Trà'
INSERT INTO [thetam1410_].[dbo].[Product] (ProductCode, CreateDate, ProductName, SpotlightVideo_ImageUrl, SpotlightVideo_ImageName, ImageUrl, ImageName, Description, CategoryID, BrandID, Price)
VALUES
(NEWID(), '2024-07-01', N'Hồng Trà Chanh', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/72hongtrachanh.png', 'hongtrachanh.png', N'Black Lemon Tea', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Trà' AND BrandID = @BrandID), @BrandID, 27000),
(NEWID(), '2024-07-01', N'Trà Lài Đác Thơm', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/73tralaidacthom.png', 'tralaidacthom.png', N'Fragrant Dac Thom Jasmine Tea', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Trà' AND BrandID = @BrandID), @BrandID, 29000),
(NEWID(), '2024-07-01', N'Trà Nhãn Sen', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/74tranhansen.png', 'tranhansen.png', N'Longan Lotus Tea', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Trà' AND BrandID = @BrandID), @BrandID, 28000),
(NEWID(), '2024-07-01', N'Trà Vải Lài', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/75traivailai.png', 'traivailai.png', N'Jasmine Tea', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Trà' AND BrandID = @BrandID), @BrandID, 30000),
(NEWID(), '2024-07-01', N'Hồng Trà Đào', NULL, NULL, 'https://smart-menu-with-ai.s3.ap-southeast-1.amazonaws.com/products/76hongtradao.png', 'hongtradao.png', N'Peach Black Tea', 
(SELECT CategoryID FROM [thetam1410_].[dbo].[Category] WHERE CategoryName = N'Trà' AND BrandID = @BrandID), @BrandID, 31000);

INSERT into [thetam1410_].[dbo].[ProductList](BrandID, ListID, ProductID, IndexInList) 
VALUES 
(21, 1, 34 ,1 ),
(21, 1, 35 ,2 ),
(21, 1, 36, 3 ),
(21, 1, 37 ,4 ),
(21, 2, 38 ,1 ),
(21, 2, 39 ,2 );