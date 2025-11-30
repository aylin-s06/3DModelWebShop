-- Script for creating test administrator
-- Password is: admin123 (hashed with BCrypt)
-- To use this script, change spring.jpa.hibernate.ddl-auto to create or create-drop in application.properties

INSERT INTO users (username, email, password_hash, role, name, created_at) 
VALUES ('admin', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'Admin User', NOW())
ON DUPLICATE KEY UPDATE role = 'ADMIN';

-- Create test user
INSERT INTO users (username, email, password_hash, role, name, created_at) 
VALUES ('testuser', 'test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Test User', NOW())
ON DUPLICATE KEY UPDATE role = 'USER';

-- Create sample categories for 3D printing shop
INSERT INTO categories (id, name, slug, parent_id) VALUES
(1, '3D Печатни Играчки и Модели', '3d-toys-models', NULL),
(2, 'Дом и Офис Аксесоари', 'home-office', NULL),
(3, 'Технологии и Гаджети', 'tech-gadgets', NULL),
(4, 'Изкуство и Колекционерски', 'art-collectibles', NULL),
(5, 'Резервни Части и Инструменти', 'parts-tools', NULL) AS new
ON DUPLICATE KEY UPDATE name = new.name;

-- Create sample products with images for 3D printing shop
-- Product 1: 3D Printed Articulated Robot
INSERT INTO products (id, title, description, price, currency, category_id, stock, material, dimensions, weight, main_image_url, created_at, updated_at) VALUES
(1, 'Артикулиран 3D Печатен Робот', 'Напълно артикулирана фигура на робот с подвижни стави, отпечатана от висококачествен PLA материал. Височина на слоя: 0.2mm, запълване: 20%. Перфектен за колекционери и деца. Наличен в различни цветове. Време за печат: ~8 часа. Включва STL файл за лична употреба.', 34.99, 'BGN', 1, 50, 'PLA', '12x10x15 cm', 0.18, 'https://picsum.photos/800/600?random=1', NOW(), NOW()) AS new
ON DUPLICATE KEY UPDATE title = new.title;

-- Product 1 Images
INSERT INTO product_images (image_url, alt_text, order_index, product_id) VALUES
('https://picsum.photos/800/600?random=11', 'Артикулиран 3D Печатен Робот - Преден Изглед', 0, 1),
('https://picsum.photos/800/600?random=12', 'Артикулиран 3D Печатен Робот - Подвижни Стави', 1, 1),
('https://picsum.photos/800/600?random=13', 'Артикулиран 3D Печатен Робот - Детайл на Слоевете', 2, 1) AS new
ON DUPLICATE KEY UPDATE image_url = new.image_url;

-- Product 2: 3D Printed Geometric Vase
INSERT INTO products (id, title, description, price, currency, category_id, stock, material, dimensions, weight, main_image_url, created_at, updated_at) VALUES
(2, '3D Печатна Геометрична Ваза', 'Модерна геометрична ваза с параметричен дизайн, отпечатана от PETG материал за водоустойчивост. Височина на слоя: 0.15mm, 3 стени, 15% запълване. Уникална структура с пчелна пита. Време за печат: ~12 часа. Водонепроницаем дизайн, подходящ за свежи цветя.', 52.99, 'BGN', 2, 30, 'PETG', '15x15x22 cm', 0.28, 'https://picsum.photos/800/600?random=2', NOW(), NOW()) AS new
ON DUPLICATE KEY UPDATE title = new.title;

-- Product 2 Images
INSERT INTO product_images (image_url, alt_text, order_index, product_id) VALUES
('https://picsum.photos/800/600?random=21', '3D Печатна Геометрична Ваза - Основен Изглед', 0, 2),
('https://picsum.photos/800/600?random=22', '3D Печатна Геометрична Ваза - Детайл на Пчелна Пита', 1, 2) AS new
ON DUPLICATE KEY UPDATE image_url = new.image_url;

-- Product 3: 3D Printed Phone Stand
INSERT INTO products (id, title, description, price, currency, category_id, stock, material, dimensions, weight, main_image_url, created_at, updated_at) VALUES
(3, '3D Печатен Регулируем Стол за Телефон', 'Ергономичен стол за телефон с регулируем механизъм за ъгъл, отпечатан от издръжлив ABS материал. Височина на слоя: 0.2mm, 4 стени, 30% запълване за здравина. Съвместим с всички размери смартфони (4" до 7"). Антиплъзгаща основа с управление на кабели. Време за печат: ~3 часа.', 24.99, 'BGN', 3, 75, 'ABS', '9x7x11 cm', 0.12, 'https://picsum.photos/800/600?random=3', NOW(), NOW()) AS new
ON DUPLICATE KEY UPDATE title = new.title;

-- Product 3 Images
INSERT INTO product_images (image_url, alt_text, order_index, product_id) VALUES
('https://picsum.photos/800/600?random=31', '3D Печатен Регулируем Стол за Телефон - Основен Изглед', 0, 3),
('https://picsum.photos/800/600?random=32', '3D Печатен Регулируем Стол за Телефон - В Употреба с Управление на Кабели', 1, 3) AS new
ON DUPLICATE KEY UPDATE image_url = new.image_url;

-- Product 4: 3D Printed Key Holder
INSERT INTO products (id, title, description, price, currency, category_id, stock, material, dimensions, weight, main_image_url, created_at, updated_at) VALUES
(4, '3D Печатен Стенален Държач за Ключове', 'Стенален организатор за ключове с 6 куки, отпечатан от PLA материал с височина на слоя 0.2mm. 3 стени, 20% запълване. Включва отвори за монтаж за лесно инсталиране. Наличен персонализиран дизайн. Време за печат: ~2 часа. Перфектен за организиране на ключове, значки и малки предмети.', 18.99, 'BGN', 2, 60, 'PLA', '22x6x3 cm', 0.08, 'https://picsum.photos/800/600?random=4', NOW(), NOW()) AS new
ON DUPLICATE KEY UPDATE title = new.title;

-- Product 4 Images
INSERT INTO product_images (image_url, alt_text, order_index, product_id) VALUES
('https://picsum.photos/800/600?random=41', '3D Печатен Стенален Държач за Ключове - Основен Изглед', 0, 4),
('https://picsum.photos/800/600?random=42', '3D Печатен Стенален Държач за Ключове - Монтиран с Ключове', 1, 4) AS new
ON DUPLICATE KEY UPDATE image_url = new.image_url;

-- Product 5: 3D Printed Art Sculpture
INSERT INTO products (id, title, description, price, currency, category_id, stock, material, dimensions, weight, main_image_url, created_at, updated_at) VALUES
(5, '3D Печатна Абстрактна Художествена Скулптура', 'Завладяваща абстрактна художествена творба със сложни геометрични модели, отпечатана с висока резолюция (0.1mm височина на слоя) от премиум PLA материал. 4 стени, 25% запълване за структурна цялост. Пост-обработена с шлайфане и опционално боядисване. Време за печат: ~15 часа. Перфектна за колекционери и любители на изкуство.', 95.99, 'BGN', 4, 20, 'PLA', '14x14x18 cm', 0.22, 'https://picsum.photos/800/600?random=5', NOW(), NOW()) AS new
ON DUPLICATE KEY UPDATE title = new.title;

-- Product 5 Images
INSERT INTO product_images (image_url, alt_text, order_index, product_id) VALUES
('https://picsum.photos/800/600?random=51', '3D Печатна Абстрактна Художествена Скулптура - Основен Изглед', 0, 5),
('https://picsum.photos/800/600?random=52', '3D Печатна Абстрактна Художествена Скулптура - Детайл на Геометричен Модел', 1, 5),
('https://picsum.photos/800/600?random=53', '3D Печатна Абстрактна Художествена Скулптура - Детайл на Слоевете', 2, 5) AS new
ON DUPLICATE KEY UPDATE image_url = new.image_url;

-- Product 6: 3D Printed Cable Organizer
INSERT INTO products (id, title, description, price, currency, category_id, stock, material, dimensions, weight, main_image_url, created_at, updated_at) VALUES
(6, '3D Печатен Комплект Клипсове за Управление на Кабели', 'Комплект от 6 клипса за управление на кабели за организиране на бюро, отпечатани от гъвкав TPU материал. Височина на слоя: 0.2mm, 3 стени. Включена самолепяща се основа. Държи множество кабели (USB, захранване, аудио) и предотвратява заплитане. Време за печат: ~1.5 часа за комплект. Наличен в различни цветове.', 16.99, 'BGN', 3, 100, 'TPU', '8x4x2 cm (всеки)', 0.05, 'https://picsum.photos/800/600?random=6', NOW(), NOW()) AS new
ON DUPLICATE KEY UPDATE title = new.title;

-- Product 6 Images
INSERT INTO product_images (image_url, alt_text, order_index, product_id) VALUES
('https://picsum.photos/800/600?random=61', '3D Печатен Комплект Клипсове за Управление на Кабели - Основен Изглед', 0, 6),
('https://picsum.photos/800/600?random=62', '3D Печатен Комплект Клипсове за Управление на Кабели - В Употреба на Бюро', 1, 6) AS new
ON DUPLICATE KEY UPDATE image_url = new.image_url;

-- Product 7: 3D Printed Plant Pot
INSERT INTO products (id, title, description, price, currency, category_id, stock, material, dimensions, weight, main_image_url, created_at, updated_at) VALUES
(7, '3D Печатен Самонапояващ се Съд за Растения', 'Модерен самонапояващ се съд за растения с интегриран резервоар, отпечатан от водоустойчив PETG материал. Височина на слоя: 0.2mm, 4 стени, 20% запълване. Включва дренажни отвори и индикатор за ниво на водата. Перфектен за сукуленти и малки растения. Време за печат: ~6 часа. Наличен в различни цветове.', 28.99, 'BGN', 2, 40, 'PETG', '13x13x11 cm', 0.15, 'https://picsum.photos/800/600?random=7', NOW(), NOW()) AS new
ON DUPLICATE KEY UPDATE title = new.title;

-- Product 7 Images
INSERT INTO product_images (image_url, alt_text, order_index, product_id) VALUES
('https://picsum.photos/800/600?random=71', '3D Печатен Самонапояващ се Съд за Растения - Основен Изглед', 0, 7),
('https://picsum.photos/800/600?random=72', '3D Печатен Самонапояващ се Съд за Растения - Със Сукулент', 1, 7) AS new
ON DUPLICATE KEY UPDATE image_url = new.image_url;

-- Product 8: 3D Printed Desk Organizer
INSERT INTO products (id, title, description, price, currency, category_id, stock, material, dimensions, weight, main_image_url, created_at, updated_at) VALUES
(8, '3D Печатен Модулен Комплект Организатор за Бюро', 'Пълен модулен системен организатор за бюро с 5 отделения за химикалки, кламери, USB устройства и малки предмети. Отпечатан от издръжлив ABS материал с височина на слоя 0.2mm, 4 стени, 25% запълване. Свързващ се дизайн позволява персонализация. Време за печат: ~8 часа. Модерен минималистичен дизайн, перфектен за домашен офис.', 42.99, 'BGN', 2, 35, 'ABS', '22x16x9 cm', 0.22, 'https://picsum.photos/800/600?random=8', NOW(), NOW()) AS new
ON DUPLICATE KEY UPDATE title = new.title;

-- Product 8 Images
INSERT INTO product_images (image_url, alt_text, order_index, product_id) VALUES
('https://picsum.photos/800/600?random=81', '3D Печатен Модулен Комплект Организатор за Бюро - Основен Изглед', 0, 8),
('https://picsum.photos/800/600?random=82', '3D Печатен Модулен Организатор за Бюро - С Офис Принадлежности', 1, 8) AS new
ON DUPLICATE KEY UPDATE image_url = new.image_url;

