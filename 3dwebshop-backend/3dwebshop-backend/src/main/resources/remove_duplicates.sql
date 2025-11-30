-- SQL скрипт за изтриване на дублирани потребители в MySQL
-- Работи със safe update mode

-- Стъпка 1: Проверете дублираните записи
SELECT username, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids
FROM users 
GROUP BY username 
HAVING count > 1;

SELECT email, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids
FROM users 
GROUP BY email 
HAVING count > 1;

-- Стъпка 2: Изтрийте дублираните по username (работи със safe mode)
-- Метод 1: Използване на временна таблица
CREATE TEMPORARY TABLE temp_duplicate_ids AS
SELECT u1.id 
FROM users u1
INNER JOIN users u2 ON u1.username = u2.username
WHERE u1.id < u2.id;

DELETE FROM users WHERE id IN (SELECT id FROM temp_duplicate_ids);
DROP TEMPORARY TABLE temp_duplicate_ids;

-- Стъпка 3: Изтрийте дублираните по email
CREATE TEMPORARY TABLE temp_duplicate_email_ids AS
SELECT u1.id 
FROM users u1
INNER JOIN users u2 ON u1.email = u2.email
WHERE u1.id < u2.id;

DELETE FROM users WHERE id IN (SELECT id FROM temp_duplicate_email_ids);
DROP TEMPORARY TABLE temp_duplicate_email_ids;

-- Алтернатива: Ако знаете точно ID-тата, използвайте директно:
-- DELETE FROM users WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16);

-- Стъпка 4: Проверете резултата
SELECT * FROM users ORDER BY id;

-- Стъпка 5: След това добавете уникалните constraints
ALTER TABLE users 
ADD UNIQUE KEY unique_username (username);

ALTER TABLE users 
ADD UNIQUE KEY unique_email (email);

