-- ПРОСТО РЕШЕНИЕ: Изтриване на дублирани потребители
-- Работи 100% със safe mode

-- Стъпка 1: Проверете кои потребители ще бъдат изтрити
SELECT id, username, email, created_at 
FROM users 
WHERE username = 'admin'
ORDER BY id;

-- Стъпка 2: Изтрийте директно по ID-та (заменете с вашите реални ID-та)
-- Това работи винаги със safe mode!
DELETE FROM users WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16);

-- Стъпка 3: Проверете резултата
SELECT * FROM users ORDER BY id;

-- Стъпка 4: Добавете уникални constraints
ALTER TABLE users 
ADD UNIQUE KEY unique_username (username);

ALTER TABLE users 
ADD UNIQUE KEY unique_email (email);



