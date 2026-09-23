-- Nami Ramen — seed data
-- Generated from src/data/menu.js by scripts/generate-seed.mjs
-- Run after schema.sql. Safe to re-run (upserts by id).

insert into categories (id, name, blurb) values
  ('ramen', 'Ramen', 'Broth simmered 14 hours'),
  ('sides', 'Sides', 'Small plates, sharable'),
  ('drinks', 'Drinks', 'Cold and hot'),
  ('extras', 'Extras', 'Build your bowl')
on conflict (id) do update set
  name = excluded.name,
  blurb = excluded.blurb;

insert into menu_items (id, category_id, image, name, price, description, tag, spice) values
  ('tonkotsu', 'ramen', '/images/ramen/Tonkotsu_ramen.jpg', 'Tonkotsu Ramen', 129, 'Rich and creamy pork bone broth with chashu pork.', 'Bestseller', 0),
  ('shoyu', 'ramen', '/images/ramen/Shoyu_Ramen.jpg', 'Shoyu Ramen', 119, 'Savory soy sauce broth with chashu pork and green onions.', null, 0),
  ('miso-ramen', 'ramen', '/images/ramen/Miso_Ramen.jpg', 'Miso Ramen', 129, 'Rich miso broth with corn, butter, and chashu pork.', null, 0),
  ('shio-ramen', 'ramen', '/images/ramen/shio_ramen.jpg', 'Shio Ramen', 119, 'Light salt-based broth with chicken and fresh vegetables.', null, 0),
  ('spicy-ramen', 'ramen', '/images/ramen/Spicy_Ramen.jpg', 'Spicy Ramen', 139, 'Spicy savory broth with chashu pork and chili oil.', 'Spicy', 2),
  ('chicken-ramen', 'ramen', '/images/ramen/Chicken_Ramen.jpg', 'Chicken Ramen', 119, 'Smooth chicken broth with tender chicken and vegetables.', null, 0),
  ('black-garlic-ramen', 'ramen', '/images/ramen/Black_Garlic_Ramen.jpg', 'Black Garlic Ramen', 149, 'Rich broth with aromatic black garlic oil and chashu pork.', null, 0),
  ('tantanmen', 'ramen', '/images/ramen/Tantanmen_Ramen.jpg', 'Tantanmen', 149, 'Creamy sesame broth with spicy minced pork.', 'Spicy', 2),
  ('chashu-ramen', 'ramen', '/images/ramen/Chashu_Ramen.jpg', 'Chashu Ramen', 159, 'Classic ramen topped with tender chashu pork.', null, 0),
  ('seafood-ramen', 'ramen', '/images/ramen/Seafood_Ramen.jpg', 'Seafood Ramen', 169, 'Savory broth with shrimp, squid, fish, and vegetables.', null, 0),
  ('vegetable-ramen', 'ramen', '/images/ramen/Vegetable_Ramen.jpg', 'Vegetable Ramen', 109, 'Light broth with fresh vegetables and green onions.', 'Vegetarian', 0),
  ('deluxe-ramen', 'ramen', '/images/ramen/Deluxe_Ramen.jpg', 'Deluxe Ramen', 179, 'Premium ramen with chashu, egg, seaweed, and bamboo shoots.', null, 0),
  ('gyoza', 'sides', '/images/sides/Gyoza.jpg', 'Gyoza', 69, 'Pan-fried Japanese dumplings filled with pork and vegetables.', null, 0),
  ('karaage', 'sides', '/images/sides/Karaage.jpg', 'Karaage', 89, 'Crispy Japanese-style fried chicken with a savory flavor.', null, 0),
  ('takoyaki', 'sides', '/images/sides/Takoyaki.jpg', 'Takoyaki', 79, 'Soft octopus balls topped with sauce, mayonnaise, and bonito flakes.', null, 0),
  ('japanese-fried-chicken-wings', 'sides', '/images/sides/Japanese_Fried_Chicken_Wings.jpg', 'Japanese Fried Chicken Wings', 89, 'Crispy chicken wings seasoned with Japanese spices.', null, 0),
  ('agedashi-tofu', 'sides', '/images/sides/Agedashi_Tofu.jpg', 'Agedashi Tofu', 69, 'Crispy tofu served with a light Japanese-style sauce.', null, 0),
  ('ebi-tempura', 'sides', '/images/sides/Ebi_Tempura.jpg', 'Ebi Tempura', 99, 'Crispy shrimp coated in light Japanese tempura batter.', null, 0),
  ('vegetable-tempura', 'sides', '/images/sides/Vegetable_Tempura.jpg', 'Vegetable Tempura', 79, 'Assorted vegetables fried in a light crispy batter.', null, 0),
  ('french-fries', 'sides', '/images/sides/french_fries.jpg', 'French Fries', 59, 'Crispy golden fries served with dipping sauce.', null, 0),
  ('ramune', 'drinks', null, 'Ramune', 45, 'Original flavor Japanese soda.', null, 0),
  ('green-tea', 'drinks', null, 'Hot Green Tea', 30, 'Roasted genmaicha.', null, 0),
  ('yuzu-soda', 'drinks', null, 'Yuzu Soda', 55, 'Refreshing Japanese citrus soda.', null, 0),
  ('calpico', 'drinks', null, 'Calpico', 50, 'Lightly sweet and creamy cultured milk drink.', null, 0),
  ('coca-cola', 'drinks', null, 'Coca-Cola', 35, 'Classic Coca-Cola served chilled.', null, 0),
  ('coca-cola-zero', 'drinks', null, 'Coca-Cola Zero', 35, 'Coca-Cola Zero Sugar served chilled.', null, 0),
  ('orange-juice', 'drinks', null, 'Orange Juice', 45, 'Bright and refreshing orange juice.', null, 0),
  ('oolong-tea', 'drinks', null, 'Oolong Tea', 35, 'Fragrant roasted oolong tea served chilled.', null, 0),
  ('matcha-latte', 'drinks', null, 'Matcha Latte', 65, 'Smooth matcha blended with creamy milk.', null, 0),
  ('thai-tea', 'drinks', null, 'Thai Tea', 35, 'Sweet and creamy Thai iced tea.', null, 0),
  ('lemon-juice', 'drinks', null, 'Lemon Juice', 35, 'Bright and refreshing lemon juice.', null, 0),
  ('extra-egg', 'extras', null, 'Extra Ajitama Egg', 25, 'Add a marinated soft-boiled egg with a rich yolk.', null, 0),
  ('extra-chashu', 'extras', null, 'Extra Chashu', 40, 'Add tender slices of slow-cooked chashu pork.', null, 0),
  ('extra-noodle', 'extras', null, 'Extra Noodles', 30, 'Add an extra serving of fresh ramen noodles.', null, 0),
  ('extra-green-onions', 'extras', null, 'Extra Green Onions', 15, 'Add fresh sliced green onions for extra freshness.', null, 0),
  ('extra-bamboo-shoots', 'extras', null, 'Extra Bamboo Shoots', 20, 'Add seasoned bamboo shoots for a crunchy texture.', null, 0),
  ('extra-seaweed', 'extras', null, 'Extra Seaweed', 15, 'Add Japanese nori seaweed for extra flavor.', null, 0),
  ('extra-corn', 'extras', null, 'Extra Corn', 15, 'Add sweet corn for a slightly sweet flavor.', null, 0),
  ('extra-black-garlic-oil', 'extras', null, 'Extra Black Garlic Oil', 15, 'Add aromatic black garlic oil for a richer taste.', null, 0),
  ('extra-spicy-sauce', 'extras', null, 'Extra Spicy Sauce', 15, 'Add spicy chili sauce for extra heat.', 'Spicy', 2),
  ('extra-butter', 'extras', null, 'Extra Butter', 20, 'Add creamy butter for a richer and smoother broth.', null, 0),
  ('extra-bean-sprouts', 'extras', null, 'Extra Bean Sprouts', 15, 'Add fresh bean sprouts for extra crunch.', null, 0),
  ('extra-pork-mince', 'extras', null, 'Extra Pork Mince', 35, 'Add seasoned minced pork for extra flavor.', null, 0)
on conflict (id) do update set
  category_id = excluded.category_id,
  image = excluded.image,
  name = excluded.name,
  price = excluded.price,
  description = excluded.description,
  tag = excluded.tag,
  spice = excluded.spice;

