# Бързо тестване на администраторските страници

## Най-бърз начин (5 минути):

### Стъпка 1: Стартирайте backend и frontend
```bash
# Terminal 1 - Backend
cd 3dwebshop-backend/3dwebshop-backend
mvn spring-boot:run

# Terminal 2 - Frontend  
cd 3dwebshop-frontend
npm start
```

### Стъпка 2: Изчистете стари потребители (ако има дублирани)

**Ако имате дублирани потребители с username 'admin':**

```sql
-- Проверете всички потребители
SELECT id, username, email, role FROM users WHERE username = 'admin';

-- Изтрийте всички стари 'admin' потребители
DELETE FROM users WHERE username = 'admin' AND email = 'admin@example.com';

-- Или използвайте ID за по-безопасно изтриване
-- DELETE FROM users WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16);
```

**Вижте `CLEANUP_USERS.md` за подробни инструкции.**

### Стъпка 3: Създайте администратор

**⭐ Най-лесен начин (Препоръчителен):**

1. Регистрирайте се като нормален потребител:
   - Отидете на `http://localhost:3000/register`
   - Създайте потребител с:
     - Потребителско име: `admin` (или друго уникално име)
     - Имейл: `admin@example.com` (или друг уникален имейл)
     - Парола: `admin123`
     - Останалите полета по желание

2. Променете ролята на ADMIN в базата данни:
   
   **Най-безопасен начин - по ID:**
   ```sql
   -- Първо намерете ID-то на новия потребител
   SELECT id, username, email, role FROM users ORDER BY id DESC LIMIT 1;
   
   -- След това актуализирайте по ID (заменете X с ID-то)
   UPDATE users SET role = 'ADMIN' WHERE id = X;
   ```
   
   **Алтернатива - по email (ако е уникален):**
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
   ```

**Алтернативен начин: Директно в базата данни (MySQL)**
```sql
-- Паролата е хеширана с BCrypt за "admin123"
INSERT INTO users (username, email, password_hash, role, name, created_at) 
VALUES ('admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'Admin User', NOW());
```
Парола: `admin123`

**Забележка:** UserController не хешира паролите автоматично, затова е по-добре да използвате регистрацията (която хешира) и след това да промените ролята.

### Стъпка 3: Влезте като администратор
1. Отидете на `http://localhost:3000/login`
2. Въведете:
   - Потребителско име: `admin`
   - Парола: `admin123`
3. Натиснете "Влез"

### Стъпка 4: Тествайте администраторските страници

След влизане ще видите в Navbar:
- Вашето потребителско име (с падащо меню)
- В менюто: "Админ панел"

**Администраторски страници:**
- `http://localhost:3000/admin` - Dashboard
- `http://localhost:3000/admin/products` - Продукти
- `http://localhost:3000/admin/products/new` - Нов продукт
- `http://localhost:3000/admin/orders` - Поръчки
- `http://localhost:3000/admin/users` - Потребители

## Проблеми и решения:

### Проблем: "Invalid password" при влизане
**Решение:** Backend хешира паролите с BCrypt. Ако създавате потребител директно в базата, трябва да хеширате паролата. Използвайте data.sql файла или създайте потребител чрез регистрация и след това променете ролята.

### Проблем: CORS грешка
**Решение:** Уверете се че backend работи на порт 8081 и SecurityConfig има правилните CORS настройки.

### Проблем: Не виждам "Админ панел" в менюто
**Решение:** Проверете че потребителят има `role: 'ADMIN'` в базата данни. Може да проверите в `/admin/users` ако вече имате друг админ.

## Промяна на съществуващ потребител на администратор:

Ако вече имате регистриран потребител:
1. Влезте като този потребител
2. Отидете на `/admin/users` (ако вече имате админ)
3. Или директно в базата:
```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'вашето_име';
```

