# Изтриване на данни и тестване - Пълна процедура

## Стъпка 1: Изключете Safe Update Mode

### Вариант A: В MySQL Workbench Preferences (Постоянно)

1. **Edit → Preferences** (или **MySQL Workbench → Preferences** на Mac)
2. Изберете **SQL Editor** от лявото меню
3. Премахнете отметката от **"Safe Updates"**
4. Натиснете **OK**
5. **Важно:** Reconnect към сървъра:
   - **Query → Reconnect to Server**
   - Или затворете и отворете connection отново

### Вариант B: Чрез SQL команда (Временно)

```sql
SET SQL_SAFE_UPDATES = 0;
```

## Стъпка 2: Изтрийте свързаните данни ПРЕДИ потребителите

**Важно:** Трябва да изтриете свързаните данни първо, защото има foreign key constraints!

```sql
-- Изтрийте поръчките
DELETE FROM orders;

-- Изтрийте елементите от количката
DELETE FROM cart_items;

-- Изтрийте order_items (ако има)
DELETE FROM order_items;
```

## Стъпка 3: Изтрийте всички потребители

```sql
-- Сега можете да изтриете потребителите
DELETE FROM users;

-- Рестартирайте auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE orders AUTO_INCREMENT = 1;
ALTER TABLE cart_items AUTO_INCREMENT = 1;

-- Проверете (трябва да е празно)
SELECT * FROM users;
```

## Стъпка 3: Добавете уникални constraints

```sql
-- Проверете дали вече съществуват
SHOW CREATE TABLE users;

-- Ако не съществуват, добавете ги
ALTER TABLE users 
ADD UNIQUE KEY unique_username (username);

ALTER TABLE users 
ADD UNIQUE KEY unique_email (email);
```

## Стъпка 4: Включете обратно safe mode (препоръчително)

```sql
SET SQL_SAFE_UPDATES = 1;
```

## Стъпка 5: Тестване

1. **Рестартирайте backend:**
   ```bash
   cd 3dwebshop-backend/3dwebshop-backend
   mvn spring-boot:run
   ```

2. **Регистрирайте нов потребител:**
   - Отидете на `http://localhost:3000/register`
   - Създайте потребител (например: `admin` / `admin@example.com` / `admin123`)

3. **Променете ролята на ADMIN:**
   ```sql
   -- Намерете новия потребител
   SELECT id, username, email, role FROM users;
   
   -- Променете ролята (заменете X с ID-то)
   UPDATE users SET role = 'ADMIN' WHERE id = X;
   ```

4. **Влезте и тествайте:**
   - Отидете на `http://localhost:3000/login`
   - Влезте с вашите данни
   - Тествайте администраторските страници

## Готов SQL скрипт:

Вижте `reset_users_table.sql` за готов скрипт който прави всичко наведнъж.

