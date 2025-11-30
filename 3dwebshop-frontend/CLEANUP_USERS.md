# Изчистване на дублирани потребители от базата данни

## ⚠️ Внимание: Това ще изтрие данни! Направете backup преди да продължите.

## Метод 1: Изтриване на всички потребители с username 'admin' (MySQL + Safe Mode)

```sql
-- Първо проверете кои ще бъдат изтрити и вземете техните ID-та
SELECT id, username, email, role, created_at 
FROM users 
WHERE username = 'admin';

-- MySQL: Изтрийте по ID (safe mode изисква PRIMARY KEY в WHERE)
DELETE FROM users WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16);
-- Заменете числата с реалните ID-та от SELECT заявката по-горе
```

**Алтернатива с JOIN (MySQL синтаксис):**
```sql
-- MySQL изисква JOIN вместо подзаявка в DELETE
DELETE u1 FROM users u1
INNER JOIN (
    SELECT id FROM users WHERE username = 'admin'
) u2 ON u1.id = u2.id;
```

## Метод 2: Изтриване само на старите записи (Запазване на най-новия)

```sql
-- Запазете най-новия потребител (ID 16) и изтрийте останалите
DELETE FROM users 
WHERE username = 'admin' 
AND id != 16;  -- Заменете 16 с ID-то на потребителя който искате да запазите
```

## Метод 3: Изтриване по ID (Най-безопасен - един по един)

```sql
-- Изтрийте всеки потребител по ID
DELETE FROM users WHERE id = 2;
DELETE FROM users WHERE id = 4;
DELETE FROM users WHERE id = 6;
DELETE FROM users WHERE id = 8;
DELETE FROM users WHERE id = 10;
DELETE FROM users WHERE id = 12;
DELETE FROM users WHERE id = 14;
DELETE FROM users WHERE id = 16;  -- Ако искате да изтриете и най-новия
```

## Метод 4: Изтриване на всички потребители (Започване от нула)

```sql
-- ⚠️ ВНИМАНИЕ: Това ще изтрие ВСИЧКИ потребители!
DELETE FROM users;

-- След това ще трябва да рестартирате auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;
```

## Метод 5: Изтриване само на тестов потребители (MySQL + Safe Mode)

```sql
-- Първо намерете ID-тата
SELECT id FROM users 
WHERE username = 'admin' 
AND email = 'admin@example.com';

-- След това изтрийте по ID (MySQL safe mode)
DELETE FROM users 
WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16);
-- Заменете с реалните ID-та от SELECT заявката
```

**Алтернатива с JOIN (MySQL синтаксис):**
```sql
DELETE u1 FROM users u1
INNER JOIN (
    SELECT id FROM users 
    WHERE username = 'admin' 
    AND email = 'admin@example.com'
) u2 ON u1.id = u2.id;
```

## Препоръчителен подход (MySQL + Safe Mode):

### Стъпка 1: Проверете всички потребители и вземете ID-тата
```sql
SELECT id, username, email, role, created_at 
FROM users 
WHERE username = 'admin'
ORDER BY id;
```

### Стъпка 2: Изтрийте дублираните 'admin' потребители по ID
```sql
-- MySQL: Най-лесен начин - директно по ID-та
DELETE FROM users WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16);
-- Заменете с реалните ID-та от SELECT заявката
```

**Алтернатива с JOIN (ако не знаете ID-тата):**
```sql
-- MySQL изисква JOIN вместо подзаявка в DELETE
DELETE u1 FROM users u1
INNER JOIN (
    SELECT id FROM users 
    WHERE username = 'admin' 
    AND email = 'admin@example.com'
) u2 ON u1.id = u2.id;
```

### Стъпка 3: Проверете резултата
```sql
SELECT * FROM users;
```

### Стъпка 4: Регистрирайте нов потребител
1. Отидете на `http://localhost:3000/register`
2. Създайте нов потребител с уникално име (например: `admin2` или `testadmin`)
3. След регистрация, променете ролята в базата:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE username = 'вашето_ново_име';
   ```

## Забележка за Foreign Keys:

Ако имате поръчки или други данни свързани с тези потребители, може да получите грешка за foreign key constraint. В този случай:

```sql
-- Първо проверете дали има свързани данни
SELECT COUNT(*) FROM orders WHERE user_id IN (2, 4, 6, 8, 10, 12, 14, 16);
SELECT COUNT(*) FROM cart_items WHERE user_id IN (2, 4, 6, 8, 10, 12, 14, 16);

-- Ако има, първо изтрийте свързаните данни или променете user_id
-- След това изтрийте потребителите
```

## След изчистване:

1. Регистрирайте нов потребител чрез `/register`
2. Променете ролята на ADMIN в базата
3. Влезте и тествайте администраторските страници

