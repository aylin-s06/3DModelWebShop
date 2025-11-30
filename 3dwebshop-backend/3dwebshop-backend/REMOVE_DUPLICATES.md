# Изтриване на дублирани потребители в MySQL (Safe Mode)

## Бързо решение за вашия случай:

От снимката виждам че имате 8 потребителя с ID-та: 2, 4, 6, 8, 10, 12, 14, 16

### Най-лесен начин - директно по ID-та:

```sql
-- Изтрийте всички стари 'admin' потребители
DELETE FROM users WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16);
```

## Общо решение за всички дубликати:

### Стъпка 1: Намерете дублираните

```sql
-- По username
SELECT username, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids
FROM users 
GROUP BY username 
HAVING count > 1;

-- По email
SELECT email, COUNT(*) as count, GROUP_CONCAT(id ORDER BY id) as ids
FROM users 
GROUP BY email 
HAVING count > 1;
```

### Стъпка 2: Изтрийте дублираните (работи със safe mode)

**Метод 1: Използване на временна таблица (Препоръчителен)**

```sql
-- За username дубликати
CREATE TEMPORARY TABLE temp_duplicate_ids AS
SELECT u1.id 
FROM users u1
INNER JOIN users u2 ON u1.username = u2.username
WHERE u1.id < u2.id;

DELETE FROM users WHERE id IN (SELECT id FROM temp_duplicate_ids);
DROP TEMPORARY TABLE temp_duplicate_ids;

-- За email дубликати
CREATE TEMPORARY TABLE temp_duplicate_email_ids AS
SELECT u1.id 
FROM users u1
INNER JOIN users u2 ON u1.email = u2.email
WHERE u1.id < u2.id;

DELETE FROM users WHERE id IN (SELECT id FROM temp_duplicate_email_ids);
DROP TEMPORARY TABLE temp_duplicate_email_ids;
```

**Метод 2: Директно по ID-та (Най-сигурен)**

```sql
-- Първо намерете ID-тата на дублираните
SELECT id, username, email, created_at 
FROM users 
WHERE username = 'admin'
ORDER BY id;

-- След това изтрийте директно (заменете с реалните ID-та)
DELETE FROM users WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16);
```

**Метод 3: Един по един**

```sql
-- За всеки дублиран, изтрийте старите един по един
DELETE FROM users WHERE id = 2;
DELETE FROM users WHERE id = 4;
DELETE FROM users WHERE id = 6;
-- ... и т.н.
```

### Стъпка 3: Проверете резултата

```sql
SELECT * FROM users ORDER BY id;
```

### Стъпка 4: Добавете уникални constraints

```sql
ALTER TABLE users 
ADD UNIQUE KEY unique_username (username);

ALTER TABLE users 
ADD UNIQUE KEY unique_email (email);
```

## Забележка:

Подзаявките в MySQL изискват временна таблица (`AS temp`) за да работят със safe update mode. Това е защото MySQL не позволява да изтривате от таблица която се чете в същата заявка.

