-- SQL скрипт за добавяне на уникални constraints в MySQL
-- Изпълнете този скрипт в MySQL Workbench или phpMyAdmin

-- Добавяне на уникален constraint за username
ALTER TABLE users 
ADD UNIQUE KEY unique_username (username);

-- Добавяне на уникален constraint за email
ALTER TABLE users 
ADD UNIQUE KEY unique_email (email);

-- Проверка на constraints
SHOW CREATE TABLE users;

