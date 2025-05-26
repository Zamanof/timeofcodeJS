-- Create Languages table
CREATE TABLE Languages (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Icon NVARCHAR(255)
);

-- Create Categories table
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    LanguageId INT NOT NULL,
    [Order] INT NOT NULL,
    FOREIGN KEY (LanguageId) REFERENCES Languages(Id)
);

-- Create Topics table
CREATE TABLE Topics (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    CategoryId INT NOT NULL,
    [Order] INT NOT NULL,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

-- Create Articles table
CREATE TABLE Articles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    TopicId INT NOT NULL,
    [Order] INT NOT NULL,
    FOREIGN KEY (TopicId) REFERENCES Topics(Id)
);

-- Create CodeExamples table
CREATE TABLE CodeExamples (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Code NVARCHAR(MAX) NOT NULL,
    Language NVARCHAR(50) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    ArticleId INT NOT NULL,
    [Order] INT NOT NULL,
    FOREIGN KEY (ArticleId) REFERENCES Articles(Id)
); 