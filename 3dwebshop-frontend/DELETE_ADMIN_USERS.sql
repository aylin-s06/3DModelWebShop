-- Скрипт за изтриване на дублирани 'admin' потребители в MySQL
-- Работи със safe update mode

-- Стъпка 1: Проверете кои потребители ще бъдат изтрити
SELECT id, username, email, role, created_at 
FROM users 
WHERE username = 'admin'
ORDER BY id;

-- Стъпка 2: Изтрийте всички 'admin' потребители
-- MySQL изисква PRIMARY KEY (id) в WHERE за safe mode

-- Вариант A: Директно по ID-та (най-бърз и сигурен)
DELETE FROM users WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16);

-- Вариант B: Използване на подзаявка (ако не знаете ID-тата)
-- В MySQL трябва да използвате временна таблица
DELETE u1 FROM users u1
INNER JOIN (
    SELECT id FROM users 
    WHERE username = 'admin' 
    AND email = 'admin@example.com'
) u2 ON u1.id = u2.id;

-- Вариант C: Един по един (най-безопасен)
-- DELETE FROM users WHERE id = 2;
-- DELETE FROM users WHERE id = 4;
-- DELETE FROM users WHERE id = 6;
-- DELETE FROM users WHERE id = 8;
-- DELETE FROM users WHERE id = 10;
-- DELETE FROM users WHERE id = 12;
-- DELETE FROM users WHERE id = 14;
-- DELETE FROM users WHERE id = 16;

-- Стъпка 3: Проверете резултата
SELECT * FROM users;

