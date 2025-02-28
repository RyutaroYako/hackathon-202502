-- Insert test data for bookstore inventory management system (Japanese content)

-- Books test data
INSERT INTO books (id, title, author, price, isbn, stock, threshold) VALUES
  ('11111111-1111-1111-1111-111111111111', '雪国', '川端康成', 1200, '9784101001012', 15, 5),
  ('22222222-2222-2222-2222-222222222222', '人間失格', '太宰治', 980, '9784167105051', 8, 5),
  ('33333333-3333-3333-3333-333333333333', '坊っちゃん', '夏目漱石', 780, '9784041001011', 3, 5),
  ('44444444-4444-4444-4444-444444444444', '舞姫', '森鴎外', 680, '9784041099018', 10, 3),
  ('55555555-5555-5555-5555-555555555555', '羅生門', '芥川龍之介', 880, '9784041099025', 7, 4),
  ('66666666-6666-6666-6666-666666666666', '蟹工船', '小林多喜二', 1100, '9784041099032', 5, 5),
  ('77777777-7777-7777-7777-777777777777', '吾輩は猫である', '夏目漱石', 1500, '9784041099049', 12, 6),
  ('88888888-8888-8888-8888-888888888888', '銀河鉄道の夜', '宮沢賢治', 950, '9784041099056', 9, 4),
  ('99999999-9999-9999-9999-999999999999', '走れメロス', '太宰治', 850, '9784041099063', 4, 5);

-- Sales test data
INSERT INTO sales (id, book_id, quantity, total_amount, date) VALUES
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 2, 2400, CURRENT_TIMESTAMP - INTERVAL '5 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', 1, 980, CURRENT_TIMESTAMP - INTERVAL '4 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', 3, 2340, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', 2, 1360, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', 1, 880, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  (gen_random_uuid(), '66666666-6666-6666-6666-666666666666', 2, 2200, CURRENT_TIMESTAMP - INTERVAL '12 hours'),
  (gen_random_uuid(), '77777777-7777-7777-7777-777777777777', 1, 1500, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', 1, 1200, CURRENT_TIMESTAMP - INTERVAL '3 hours');