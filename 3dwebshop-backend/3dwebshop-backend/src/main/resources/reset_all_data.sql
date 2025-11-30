-- ПЪЛЕН РЕСЕТ: Изтриване на всички данни от базата
-- Изпълнете след като изключите safe mode

-- Стъпка 1: Изключете safe mode
SET SQL_SAFE_UPDATES = 0;

-- Стъпка 2: Изтрийте свързаните данни (в правилния ред за да избегнете foreign key грешки)

-- 2.1. Изтрийте order_items (ако има такава таблица)
DELETE FROM order_items;

-- 2.2. Изтрийте поръчките
DELETE FROM orders;

-- 2.3. Изтрийте елементите от количката
DELETE FROM cart_items;

-- 2.4. Изтрийте ревютата (ако има)
-- DELETE FROM reviews;

-- 2.5. Изтрийте product_files (ако има foreign key към users)
-- DELETE FROM product_files;

-- 2.6. Изтрийте product_images (ако има foreign key към users)
-- DELETE FROM product_images;

-- Стъпка 3: Изтрийте потребителите
DELETE FROM users;

-- Стъпка 4: Рестартирайте auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE cart_items AUTO_INCREMENT = 1;

-- Стъпка 5: Проверете резултата
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Orders:', COUNT(*) FROM orders
UNION ALL
SELECT 'Cart Items:', COUNT(*) FROM cart_items;

-- Стъпка 6: Добавете уникални constraints (ако все още не са добавени)
-- Проверете първо:
SHOW CREATE TABLE users;

-- Ако не съществуват, добавете ги:
ALTER TABLE users 
ADD UNIQUE KEY unique_username (username);

ALTER TABLE users 
ADD UNIQUE KEY unique_email (email);

-- Стъпка 7: Включете обратно safe mode (препоръчително)
SET SQL_SAFE_UPDATES = 1;

-- Готово! Сега можете да регистрирате нови потребители

