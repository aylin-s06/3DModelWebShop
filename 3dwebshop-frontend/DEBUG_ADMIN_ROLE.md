# Дебъгване на Админ ролята

## Проблем: Не виждам "Админ панел" в Navbar

### Стъпка 1: Проверете ролята в базата данни

```sql
-- Проверете всички потребители и техните роли
SELECT id, username, email, role FROM users;

-- Проверете конкретно вашия потребител
SELECT id, username, email, role FROM users WHERE username = 'вашето_име';
```

**Важно:** Ролята трябва да е точно `'ADMIN'` (с главни букви).

### Стъпка 2: Променете ролята на ADMIN (ако не е)

```sql
-- Променете ролята (заменете X с ID-то на вашия потребител)
UPDATE users SET role = 'ADMIN' WHERE id = X;

-- Проверете отново
SELECT id, username, email, role FROM users WHERE id = X;
```

### Стъпка 3: Излезте и влезте отново

**Много важно:** След промяна на ролята в базата данни, трябва да:
1. Излезте от системата (logout)
2. Влезте отново (login)

Причина: JWT токенът се генерира при login и съдържа ролята. Ако промените ролята в базата, старият токен все още има старата роля.

### Стъпка 4: Проверете в браузъра (Console)

Отворете Developer Tools (F12) и в Console напишете:

```javascript
// Проверете токена
const token = localStorage.getItem('token');
console.log('Token:', token);

// Декодирайте токена (ако има)
if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Role in token:', payload.role);
    console.log('User ID:', payload.userId);
    console.log('Username:', payload.sub || payload.username);
}

// Проверете user обекта в React
// В Console на React DevTools или временно добавете в Navbar.js:
// console.log('User:', user, 'isAdmin:', isAdmin());
```

### Стъпка 5: Проверете в Network tab

1. Отворете Developer Tools (F12)
2. Отидете на Network tab
3. Презаредете страницата
4. Намерете заявката към `/api/users` или `/api/users/{id}`
5. Проверете Response - трябва да видите `"role": "ADMIN"`

### Стъпка 6: Добавете временен debug в Navbar.js

Временно добавете в Navbar.js след ред 10:

```javascript
console.log('DEBUG:', { 
    user, 
    isAuthenticated, 
    isAdmin: isAdmin(), 
    userRole: user?.role 
});
```

## Често срещани проблеми:

### Проблем 1: Ролята в базата не е 'ADMIN'
**Решение:** Променете на точно `'ADMIN'` (с главни букви)

### Проблем 2: Не сте излезли и влезли отново
**Решение:** Излезте (logout) и влезте отново (login) след промяна на ролята

### Проблем 3: Стар JWT токен
**Решение:** Изтрийте token от localStorage:
```javascript
localStorage.removeItem('token');
```
След това влезте отново.

### Проблем 4: User обектът не се зарежда
**Решение:** Проверете дали `/api/users/{id}` endpoint работи правилно

## Бърз тест:

1. Проверете в MySQL: `SELECT id, username, role FROM users;`
2. Променете ролята: `UPDATE users SET role = 'ADMIN' WHERE id = X;`
3. Излезте от системата (logout)
4. Влезте отново (login)
5. Проверете дали виждате "Админ панел"

