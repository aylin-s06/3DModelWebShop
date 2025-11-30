# Как да поправите ролята на администратор

## Проблем: Множество потребители с едно и също име

Ако имате много потребители с username 'admin', ето как да намерите и актуализирате правилния:

### Стъпка 1: Намерете всички потребители
```sql
SELECT id, username, email, role, created_at 
FROM users 
WHERE username = 'admin' 
ORDER BY created_at DESC;
```

### Стъпка 2: Изберете правилния потребител
Вижте резултатите и изберете потребителя който искате да направите администратор (обикновено най-новият).

### Стъпка 3: Актуализирайте по ID
```sql
-- Заменете 1 с ID-то на вашия потребител
UPDATE users SET role = 'ADMIN' WHERE id = 1;
```

## Алтернативни методи:

### Метод 1: По email (ако е уникален)
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'вашият_имейл@example.com';
```

### Метод 2: Най-новият потребител с това име
```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE id = (
    SELECT id FROM (
        SELECT id FROM users 
        WHERE username = 'admin' 
        ORDER BY created_at DESC 
        LIMIT 1
    ) AS temp
);
```

### Метод 3: Изключете safe mode (внимателно!)
```sql
SET SQL_SAFE_UPDATES = 0;
UPDATE users SET role = 'ADMIN' WHERE username = 'admin' LIMIT 1;
SET SQL_SAFE_UPDATES = 1;
```

## Препоръка:

**Най-безопасният начин е да използвате ID:**
1. Намерете вашия потребител: `SELECT * FROM users WHERE username = 'admin';`
2. Запишете ID-то
3. Актуализирайте: `UPDATE users SET role = 'ADMIN' WHERE id = [вашето_ID];`

## Проверка:

След актуализация, проверете:
```sql
SELECT id, username, email, role FROM users WHERE id = [вашето_ID];
```

Трябва да видите `role = 'ADMIN'`.

