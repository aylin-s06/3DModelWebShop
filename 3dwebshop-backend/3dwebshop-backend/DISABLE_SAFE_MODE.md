# Как да изключите Safe Update Mode в MySQL Workbench

## Метод 1: Чрез Preferences (Постоянно)

1. Отворете MySQL Workbench
2. Отидете на: **Edit → Preferences** (или **MySQL Workbench → Preferences** на Mac)
3. В лявото меню изберете: **SQL Editor**
4. Намерете опцията: **"Safe Updates"** (или **"Safe Updates (rejects UPDATEs and DELETEs with no restrictions)"**)
5. **Премахнете отметката** от Safe Updates
6. Натиснете **OK**
7. **Важно:** Трябва да се **reconnect** (презаредите връзката) за да влезе в сила!

### Как да се reconnect:
- Затворете текущата connection
- Отворете нова connection
- Или натиснете **Query → Reconnect to Server**

## Метод 2: Чрез SQL команда (Временно - само за текущата сесия)

```sql
-- Изключете safe mode за текущата сесия
SET SQL_SAFE_UPDATES = 0;

-- След това можете да изпълнявате DELETE/UPDATE заявки
DELETE FROM users;

-- Включете обратно safe mode (препоръчително)
SET SQL_SAFE_UPDATES = 1;
```

## Изтриване на всички потребители

### ⚠️ ВАЖНО: Първо изтрийте свързаните данни!

Има foreign key constraints, затова трябва да изтриете свързаните данни ПРЕДИ потребителите:

```sql
-- Изключете safe mode
SET SQL_SAFE_UPDATES = 0;

-- Стъпка 1: Изтрийте свързаните данни
DELETE FROM order_items;  -- Ако има такава таблица
DELETE FROM orders;
DELETE FROM cart_items;

-- Стъпка 2: Сега можете да изтриете потребителите
DELETE FROM users;

-- Стъпка 3: Рестартирайте auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE cart_items AUTO_INCREMENT = 1;

-- Включете обратно safe mode
SET SQL_SAFE_UPDATES = 1;
```

## Пълна процедура за тестване:

```sql
-- 1. Изключете safe mode
SET SQL_SAFE_UPDATES = 0;

-- 2. Изтрийте всички потребители
DELETE FROM users;

-- 3. Рестартирайте auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;

-- 4. Проверете (трябва да е празно)
SELECT * FROM users;

-- 5. Включете обратно safe mode
SET SQL_SAFE_UPDATES = 1;

-- 6. Добавете уникални constraints (ако все още не са добавени)
ALTER TABLE users 
ADD UNIQUE KEY unique_username (username);

ALTER TABLE users 
ADD UNIQUE KEY unique_email (email);
```

## Забележка:

- **Метод 1 (Preferences)** - изключва safe mode **за постоянно** за всички нови connections
- **Метод 2 (SQL команда)** - изключва safe mode **само за текущата сесия**

След изтриване на данните, можете да регистрирате нови потребители чрез `/register` и да тествате системата!

