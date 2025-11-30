# Добавяне на уникални constraints в MySQL

## Важно: Изпълнете този SQL скрипт в базата данни

За да предотвратите дублирани потребители, трябва да добавите уникални constraints в MySQL:

```sql
-- Добавяне на уникален constraint за username
ALTER TABLE users 
ADD UNIQUE KEY unique_username (username);

-- Добавяне на уникален constraint за email
ALTER TABLE users 
ADD UNIQUE KEY unique_email (email);
```

## Ако има грешка "Duplicate entry"

Ако получите грешка че вече има дублирани записи, първо изтрийте дублираните:

### Стъпка 1: Намерете дублираните записи

```sql
-- Намерете дублираните по username
SELECT username, COUNT(*) as count, GROUP_CONCAT(id) as ids
FROM users 
GROUP BY username 
HAVING count > 1;

-- Намерете дублираните по email
SELECT email, COUNT(*) as count, GROUP_CONCAT(id) as ids
FROM users 
GROUP BY email 
HAVING count > 1;
```

### Стъпка 2: Изтрийте дублираните (MySQL Safe Mode)

**Вариант A: По конкретни ID-та (най-безопасен)**

```sql
-- За username дубликати - запазете най-новия (най-голямото ID)
-- Първо вижте кои ID-та са дублирани
SELECT id, username, created_at 
FROM users 
WHERE username IN (
    SELECT username FROM (
        SELECT username FROM users 
        GROUP BY username 
        HAVING COUNT(*) > 1
    ) AS temp
)
ORDER BY username, id DESC;

-- След това изтрийте старите (заменете с реалните ID-та)
DELETE FROM users WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16);
-- Запазете само най-новия за всеки username
```

**Вариант B: Използване на подзаявка (работи със safe mode)**

```sql
-- За username - изтриване на старите, запазване на най-новия
DELETE FROM users 
WHERE id IN (
    SELECT id FROM (
        SELECT u1.id 
        FROM users u1
        INNER JOIN users u2 ON u1.username = u2.username
        WHERE u1.id < u2.id
    ) AS temp
);

-- За email - изтриване на старите, запазване на най-новия
DELETE FROM users 
WHERE id IN (
    SELECT id FROM (
        SELECT u1.id 
        FROM users u1
        INNER JOIN users u2 ON u1.email = u2.email
        WHERE u1.id < u2.id
    ) AS temp
);
```

**Вариант C: Един по един (най-сигурен)**

```sql
-- За всеки дублиран username, запазете само най-новия
-- Първо намерете ID-тата на старите
SELECT MIN(id) as old_id, username
FROM users
GROUP BY username
HAVING COUNT(*) > 1;

-- След това изтрийте старите един по един
DELETE FROM users WHERE id = [старо_ID];
```

След това добавете constraints отново.

## Проверка

След добавяне на constraints, проверете:

```sql
SHOW CREATE TABLE users;
```

Трябва да видите `UNIQUE KEY unique_username` и `UNIQUE KEY unique_email`.

