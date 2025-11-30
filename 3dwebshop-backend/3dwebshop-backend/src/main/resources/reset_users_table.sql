-- Скрипт за изтриване на всички потребители и рестарт на таблицата
-- Изпълнете след като изключите safe mode

-- Стъпка 1: Изключете safe mode (ако не сте го направили в Preferences)
SET SQL_SAFE_UPDATES = 0;

-- Стъпка 2: Изтрийте свързаните данни ПРЕДИ потребителите
-- Изтрийте поръчките (orders)
DELETE FROM orders;

-- Изтрийте елементите от количката (cart_items)
DELETE FROM cart_items;

-- Изтрийте ревютата (reviews) - ако има такава таблица
-- DELETE FROM reviews;

-- Стъпка 3: Изтрийте всички потребители
DELETE FROM users;

-- Стъпка 3: Рестартирайте auto-increment (започва от 1)
ALTER TABLE users AUTO_INCREMENT = 1;

-- Стъпка 4: Проверете резултата (трябва да е празно)
SELECT * FROM users;

-- Стъпка 5: Добавете уникални constraints (ако все още не са добавени)
-- Проверете първо дали вече съществуват:
SHOW CREATE TABLE users;

-- Ако не съществуват, добавете ги:
ALTER TABLE users 
ADD UNIQUE KEY unique_username (username);

ALTER TABLE users 
ADD UNIQUE KEY unique_email (email);

-- Стъпка 6: Включете обратно safe mode (препоръчително)
SET SQL_SAFE_UPDATES = 1;

-- Готово! Сега можете да регистрирате нови потребители чрез /register

