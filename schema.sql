-- Create Sheet "UserInfo"
CREATE TABLE UserInfo (
    UserId INT PRIMARY KEY,
    Username VARCHAR(128) NOT NULL,
    Email VARCHAR(512),
    Bio TEXT,
    EducationID INT,
    SchoolID INT NOT NULL,
    Avatar VARCHAR(255),
    Cover VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    StatusCode VARCHAR(255),
    StatusTill TIMESTAMP,
);

-- Create Sheet "Password"
CREATE TABLE Password (
    UserId INT PRIMARY KEY,
    Password VARCHAR(255) NOT NULL
);

-- Create Sheet "2ndAuth"
CREATE TABLE SecondAuth (
    UserId INT PRIMARY KEY,
    Authenticator VARCHAR(255),
    Email VARCHAR(512),
    Strategy INT
    -- 0 -> "Require on new device"
    -- 1 -> "Require every time login"
    -- 2 -> "Disabled"
);