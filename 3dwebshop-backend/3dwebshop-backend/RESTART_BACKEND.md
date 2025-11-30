# Важно: Рестартирайте Backend!

## Проблем: 403 Forbidden при заявки към /api/users

След промените в SecurityConfig и JWT класовете, **BACKEND ТРЯБВА ДА БЪДЕ РЕСТАРТИРАН** за да влезе в сила новата конфигурация.

## Как да рестартирате:

### Метод 1: Спрете и стартирайте отново

1. **Спрете backend:**
   - Натиснете `Ctrl+C` в терминала където работи backend
   - Или затворете терминала

2. **Стартирайте отново:**
   ```bash
   cd 3dwebshop-backend/3dwebshop-backend
   mvn spring-boot:run
   ```

### Метод 2: Ако използвате IDE (IntelliJ IDEA, Eclipse)

1. Спрете приложението (Stop button)
2. Стартирайте отново (Run button)

## Проверка че backend работи:

След рестарт, проверете backend конзолата за:
- `Started Application in X seconds`
- Няма грешки при стартиране

## След рестарт:

1. **Излезте от frontend:**
   - В Console (F12) напишете: `localStorage.removeItem('token')`
   - Презаредете страницата (F5)

2. **Влезте отново:**
   - Отидете на `/login`
   - Влезте с вашите данни

3. **Проверете Console:**
   - Трябва да видите: `✅ User loaded: {id: 1, username: '...', role: 'ADMIN', ...}`
   - Няма да има 403 грешки

## Ако все още има проблеми:

Проверете backend конзолата за:
- `✅ JWT Authentication successful for user: ... with role: ...`
- Или `❌ JWT Token validation failed`
- Или `⚠️ No Authorization header found for: /api/users/1`

Ако виждате `⚠️ No Authorization header`, това означава че токенът не се изпраща правилно от frontend.



