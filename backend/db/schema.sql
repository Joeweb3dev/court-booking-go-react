-- 如果数据库已存在，先删除
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'CourtBooking')
BEGIN
    USE master;
    ALTER DATABASE CourtBooking SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CourtBooking;
END
GO

-- 创建新数据库
CREATE DATABASE CourtBooking;
GO

-- 使用新创建的数据库
USE CourtBooking;
GO

-- 创建场地表
CREATE TABLE Courts (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT N'可用',
    CreateTime DATETIME DEFAULT GETDATE(),
    UpdateTime DATETIME DEFAULT GETDATE()
);
GO

-- 创建预订表
CREATE TABLE Bookings (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CourtID INT NOT NULL,
    UserName NVARCHAR(100) NOT NULL,
    BookingDate DATE NOT NULL,
    BookingTime TIME NOT NULL,
    Status NVARCHAR(50) DEFAULT N'已预订',  -- 预订状态：已预订、已取消、已完成
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CourtID) REFERENCES Courts(ID)
);
GO

-- 创建更新时间触发器
CREATE TRIGGER Courts_UpdateTrigger
ON Courts
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Courts
    SET UpdateTime = GETDATE()
    FROM Courts c
    INNER JOIN inserted i ON c.ID = i.ID;
END
GO

CREATE TRIGGER Bookings_UpdateTrigger
ON Bookings
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Bookings
    SET UpdatedAt = GETDATE()
    FROM Bookings b
    INNER JOIN inserted i ON b.ID = i.ID;
END
GO

-- 插入测试数据
INSERT INTO Courts (Name, Status) VALUES 
    (N'羽毛球场A', N'可用'),
    (N'羽毛球场B', N'可用'),
    (N'羽毛球场C', N'可用'),
    (N'网球场A', N'可用'),
    (N'网球场B', N'可用');
GO

-- 创建视图：当前可用场地
CREATE VIEW vw_AvailableCourts
AS
SELECT 
    c.ID,
    c.Name,
    c.Status
FROM Courts c
WHERE c.Status = N'可用'
GO

-- 创建存储过程：预订场地
CREATE PROCEDURE sp_BookCourt
    @CourtID INT,
    @UserName NVARCHAR(100),
    @BookingDate DATE,
    @BookingTime TIME
AS
BEGIN
    SET NOCOUNT ON;

    -- 检查时间段是否已被预订
    IF EXISTS (
        SELECT 1 
        FROM Bookings 
        WHERE CourtID = @CourtID 
            AND BookingDate = @BookingDate 
            AND BookingTime = @BookingTime
            AND Status = N'已预订'
    )
    BEGIN
        RAISERROR (N'该时间段已被预订', 16, 1);
        RETURN;
    END

    -- 插入预订记录
    INSERT INTO Bookings (CourtID, UserName, BookingDate, BookingTime)
    VALUES (@CourtID, @UserName, @BookingDate, @BookingTime);

    SELECT SCOPE_IDENTITY() AS BookingID;
END
GO

-- 创建存储过程：取消预订
CREATE PROCEDURE sp_CancelBooking
    @BookingID INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Bookings
    SET Status = N'已取消'
    WHERE ID = @BookingID;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR (N'预订记录不存在', 16, 1);
        RETURN;
    END
END
GO

-- 创建函数：检查场地是否可预订
CREATE FUNCTION fn_IsCourtAvailable
(
    @CourtID INT,
    @BookingDate DATE,
    @BookingTime TIME
)
RETURNS BIT
AS
BEGIN
    DECLARE @IsAvailable BIT = 1;

    IF EXISTS (
        SELECT 1 
        FROM Bookings 
        WHERE CourtID = @CourtID 
            AND BookingDate = @BookingDate 
            AND BookingTime = @BookingTime
            AND Status = N'已预订'
    )
    BEGIN
        SET @IsAvailable = 0;
    END

    RETURN @IsAvailable;
END
GO

-- 创建索引以提高查询性能
CREATE INDEX IX_Bookings_CourtID ON Bookings(CourtID);
CREATE INDEX IX_Bookings_BookingDate ON Bookings(BookingDate);
CREATE INDEX IX_Bookings_Status ON Bookings(Status);
GO