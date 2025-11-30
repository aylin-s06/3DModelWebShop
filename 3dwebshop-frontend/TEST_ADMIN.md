# Как да тествате администраторските страници

## Метод 1: Създаване на администратор чрез AdminUsers страницата (ако вече имате админ)

1. Влезте като администратор
2. Отидете на `/admin/users`
3. Създайте нов потребител или променете ролята на съществуващ потребител на "ADMIN"

## Метод 2: Създаване на администратор директно в базата данни

### Чрез MySQL Workbench или phpMyAdmin:

```sql
INSERT INTO users (username, email, password_hash, role, name, created_at) 
VALUES ('admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'Admin User', NOW());
```

**Паролата за този потребител е: `admin123`**

### Или използвайте следния SQL за хеширане на ваша парола:

Първо, стартирайте backend приложението и използвайте BCrypt за да хеширате паролата.

## Метод 3: Използване на Postman/curl за създаване на администратор

### Стъпка 1: Регистрирайте се като нормален потребител
```bash
POST http://localhost:8081/api/users
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "passwordHash": "admin123",
  "role": "ADMIN",
  "name": "Admin User"
}
```

### Стъпка 2: Влезте като администратор
```bash
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "passwordHash": "admin123"
}
```

## Метод 4: Промяна на съществуващ потребител на администратор

### Чрез SQL:
```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'вашето_потребителско_име';
```

### Чрез API (ако вече имате админ):
```bash
PUT http://localhost:8081/api/users/{userId}
Content-Type: application/json
Authorization: Bearer {your_jwt_token}

{
  "username": "existing_user",
  "email": "existing@example.com",
  "passwordHash": "existing_password",
  "role": "ADMIN",
  "name": "Existing User"
}
```

## След създаване на администратор:

1. Стартирайте frontend приложението:
   ```bash
   cd 3dwebshop-frontend
   npm start
   ```

2. Отидете на `http://localhost:3000/login`

3. Влезте с администраторските данни

4. След влизане, ще видите:
   - В Navbar: ваше потребителско име с падащо меню
   - В менюто: опция "Админ панел"
   - В профила: бутон "Административен панел"

5. Отидете на `/admin` за да видите Dashboard

## Администраторски страници за тестване:

- `/admin` - Dashboard с метрики
- `/admin/products` - Управление на продукти
- `/admin/products/new` - Добавяне на нов продукт
- `/admin/products/:id/edit` - Редактиране на продукт
- `/admin/orders` - Управление на поръчки
- `/admin/users` - Управление на потребители

## Забележка:

Ако паролата не работи, backend-ът използва BCrypt хеширане. Може да трябва да хеширате паролата правилно или да използвате UserService.register() метода който автоматично хешира паролата.

