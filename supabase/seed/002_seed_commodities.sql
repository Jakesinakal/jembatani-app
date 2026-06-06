-- =============================================================================
-- JembaTani — Seed: Commodities & Price History
-- Run this in the Supabase SQL Editor AFTER running 001_initial_schema.sql.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Commodities (28 rows)
-- ---------------------------------------------------------------------------
INSERT INTO public.commodities (name, category, photo, unit) VALUES

  -- SAYURAN
  ('Cabai Merah',    'SAYURAN',    'https://images.unsplash.com/photo-1588252306573-6cd7a4f0b3de?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Kentang',        'SAYURAN',    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Tomat',          'SAYURAN',    'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Wortel',         'SAYURAN',    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Bayam',          'SAYURAN',    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400', '/ikat'),
  ('Buncis',         'SAYURAN',    'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Kangkung',       'SAYURAN',    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400', '/ikat'),
  ('Terong',         'SAYURAN',    'https://images.unsplash.com/photo-1614806687007-2215e5e04dca?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Kacang Panjang', 'SAYURAN',    'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Cabai Rawit',    'SAYURAN',    'https://images.unsplash.com/photo-1588252306573-6cd7a4f0b3de?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Kol',            'SAYURAN',    'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Timun',          'SAYURAN',    'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Daun Bawang',    'SAYURAN',    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Labu Siam',      'SAYURAN',    'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Seledri',        'SAYURAN',    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400', '/kg'),

  -- BUAH
  ('Mangga',         'BUAH',       'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Pisang',         'BUAH',       'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=400', '/sisir'),
  ('Jeruk',          'BUAH',       'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Pepaya',         'BUAH',       'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Semangka',       'BUAH',       'https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&q=80&w=400', '/kg'),

  -- PADI
  ('Beras',          'PADI',       'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Jagung',         'PADI',       'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400', '/kg'),

  -- REMPAH
  ('Bawang Merah',   'REMPAH',     'https://images.unsplash.com/photo-1618228473030-a314b304c4f3?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Bawang Putih',   'REMPAH',     'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Jahe',           'REMPAH',     'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=400', '/kg'),

  -- PERKEBUNAN
  ('Kopi Arabika',   'PERKEBUNAN', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Kopi Robusta',   'PERKEBUNAN', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400', '/kg'),
  ('Kelapa Sawit',   'PERKEBUNAN', 'https://images.unsplash.com/photo-1611095787215-4b5b5e6c8bfa?auto=format&fit=crop&q=80&w=400', '/kg');


-- ---------------------------------------------------------------------------
-- Commodity price history (6 data points × 28 commodities = 168 rows)
-- Dates: 1 Mei–25 Mei 2026
-- ---------------------------------------------------------------------------
INSERT INTO public.commodity_prices (commodity_id, date, price) VALUES

  -- Cabai Merah
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Merah'), '2026-05-01', 32000),
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Merah'), '2026-05-05', 32500),
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Merah'), '2026-05-10', 33100),
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Merah'), '2026-05-15', 33500),
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Merah'), '2026-05-20', 34000),
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Merah'), '2026-05-25', 35200),

  -- Kentang
  ((SELECT id FROM public.commodities WHERE name = 'Kentang'), '2026-05-01', 15200),
  ((SELECT id FROM public.commodities WHERE name = 'Kentang'), '2026-05-05', 15150),
  ((SELECT id FROM public.commodities WHERE name = 'Kentang'), '2026-05-10', 14900),
  ((SELECT id FROM public.commodities WHERE name = 'Kentang'), '2026-05-15', 14800),
  ((SELECT id FROM public.commodities WHERE name = 'Kentang'), '2026-05-20', 14660),
  ((SELECT id FROM public.commodities WHERE name = 'Kentang'), '2026-05-25', 14500),

  -- Tomat
  ((SELECT id FROM public.commodities WHERE name = 'Tomat'), '2026-05-01', 9200),
  ((SELECT id FROM public.commodities WHERE name = 'Tomat'), '2026-05-05', 9400),
  ((SELECT id FROM public.commodities WHERE name = 'Tomat'), '2026-05-10', 9550),
  ((SELECT id FROM public.commodities WHERE name = 'Tomat'), '2026-05-15', 9600),
  ((SELECT id FROM public.commodities WHERE name = 'Tomat'), '2026-05-20', 9720),
  ((SELECT id FROM public.commodities WHERE name = 'Tomat'), '2026-05-25', 9800),

  -- Wortel
  ((SELECT id FROM public.commodities WHERE name = 'Wortel'), '2026-05-01', 9200),
  ((SELECT id FROM public.commodities WHERE name = 'Wortel'), '2026-05-05', 9000),
  ((SELECT id FROM public.commodities WHERE name = 'Wortel'), '2026-05-10', 8900),
  ((SELECT id FROM public.commodities WHERE name = 'Wortel'), '2026-05-15', 8800),
  ((SELECT id FROM public.commodities WHERE name = 'Wortel'), '2026-05-20', 8700),
  ((SELECT id FROM public.commodities WHERE name = 'Wortel'), '2026-05-25', 8500),

  -- Bayam
  ((SELECT id FROM public.commodities WHERE name = 'Bayam'), '2026-05-01', 4200),
  ((SELECT id FROM public.commodities WHERE name = 'Bayam'), '2026-05-05', 4400),
  ((SELECT id FROM public.commodities WHERE name = 'Bayam'), '2026-05-10', 4600),
  ((SELECT id FROM public.commodities WHERE name = 'Bayam'), '2026-05-15', 4700),
  ((SELECT id FROM public.commodities WHERE name = 'Bayam'), '2026-05-20', 4800),
  ((SELECT id FROM public.commodities WHERE name = 'Bayam'), '2026-05-25', 5000),

  -- Buncis
  ((SELECT id FROM public.commodities WHERE name = 'Buncis'), '2026-05-01', 12500),
  ((SELECT id FROM public.commodities WHERE name = 'Buncis'), '2026-05-05', 12200),
  ((SELECT id FROM public.commodities WHERE name = 'Buncis'), '2026-05-10', 11900),
  ((SELECT id FROM public.commodities WHERE name = 'Buncis'), '2026-05-15', 11700),
  ((SELECT id FROM public.commodities WHERE name = 'Buncis'), '2026-05-20', 11500),
  ((SELECT id FROM public.commodities WHERE name = 'Buncis'), '2026-05-25', 11000),

  -- Kangkung
  ((SELECT id FROM public.commodities WHERE name = 'Kangkung'), '2026-05-01', 2800),
  ((SELECT id FROM public.commodities WHERE name = 'Kangkung'), '2026-05-05', 3000),
  ((SELECT id FROM public.commodities WHERE name = 'Kangkung'), '2026-05-10', 3100),
  ((SELECT id FROM public.commodities WHERE name = 'Kangkung'), '2026-05-15', 3200),
  ((SELECT id FROM public.commodities WHERE name = 'Kangkung'), '2026-05-20', 3200),
  ((SELECT id FROM public.commodities WHERE name = 'Kangkung'), '2026-05-25', 3500),

  -- Terong
  ((SELECT id FROM public.commodities WHERE name = 'Terong'), '2026-05-01', 8000),
  ((SELECT id FROM public.commodities WHERE name = 'Terong'), '2026-05-05', 7700),
  ((SELECT id FROM public.commodities WHERE name = 'Terong'), '2026-05-10', 7500),
  ((SELECT id FROM public.commodities WHERE name = 'Terong'), '2026-05-15', 7400),
  ((SELECT id FROM public.commodities WHERE name = 'Terong'), '2026-05-20', 7200),
  ((SELECT id FROM public.commodities WHERE name = 'Terong'), '2026-05-25', 7000),

  -- Kacang Panjang
  ((SELECT id FROM public.commodities WHERE name = 'Kacang Panjang'), '2026-05-01', 7800),
  ((SELECT id FROM public.commodities WHERE name = 'Kacang Panjang'), '2026-05-05', 8000),
  ((SELECT id FROM public.commodities WHERE name = 'Kacang Panjang'), '2026-05-10', 8200),
  ((SELECT id FROM public.commodities WHERE name = 'Kacang Panjang'), '2026-05-15', 8400),
  ((SELECT id FROM public.commodities WHERE name = 'Kacang Panjang'), '2026-05-20', 8500),
  ((SELECT id FROM public.commodities WHERE name = 'Kacang Panjang'), '2026-05-25', 9000),

  -- Cabai Rawit
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Rawit'), '2026-05-01', 42000),
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Rawit'), '2026-05-05', 44000),
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Rawit'), '2026-05-10', 46000),
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Rawit'), '2026-05-15', 47000),
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Rawit'), '2026-05-20', 48000),
  ((SELECT id FROM public.commodities WHERE name = 'Cabai Rawit'), '2026-05-25', 52000),

  -- Kol
  ((SELECT id FROM public.commodities WHERE name = 'Kol'), '2026-05-01', 7000),
  ((SELECT id FROM public.commodities WHERE name = 'Kol'), '2026-05-05', 6800),
  ((SELECT id FROM public.commodities WHERE name = 'Kol'), '2026-05-10', 6600),
  ((SELECT id FROM public.commodities WHERE name = 'Kol'), '2026-05-15', 6400),
  ((SELECT id FROM public.commodities WHERE name = 'Kol'), '2026-05-20', 6200),
  ((SELECT id FROM public.commodities WHERE name = 'Kol'), '2026-05-25', 6000),

  -- Timun
  ((SELECT id FROM public.commodities WHERE name = 'Timun'), '2026-05-01', 4800),
  ((SELECT id FROM public.commodities WHERE name = 'Timun'), '2026-05-05', 5000),
  ((SELECT id FROM public.commodities WHERE name = 'Timun'), '2026-05-10', 5100),
  ((SELECT id FROM public.commodities WHERE name = 'Timun'), '2026-05-15', 5200),
  ((SELECT id FROM public.commodities WHERE name = 'Timun'), '2026-05-20', 5300),
  ((SELECT id FROM public.commodities WHERE name = 'Timun'), '2026-05-25', 5500),

  -- Daun Bawang
  ((SELECT id FROM public.commodities WHERE name = 'Daun Bawang'), '2026-05-01', 10000),
  ((SELECT id FROM public.commodities WHERE name = 'Daun Bawang'), '2026-05-05', 10500),
  ((SELECT id FROM public.commodities WHERE name = 'Daun Bawang'), '2026-05-10', 11000),
  ((SELECT id FROM public.commodities WHERE name = 'Daun Bawang'), '2026-05-15', 11200),
  ((SELECT id FROM public.commodities WHERE name = 'Daun Bawang'), '2026-05-20', 11500),
  ((SELECT id FROM public.commodities WHERE name = 'Daun Bawang'), '2026-05-25', 12000),

  -- Labu Siam
  ((SELECT id FROM public.commodities WHERE name = 'Labu Siam'), '2026-05-01', 4000),
  ((SELECT id FROM public.commodities WHERE name = 'Labu Siam'), '2026-05-05', 4200),
  ((SELECT id FROM public.commodities WHERE name = 'Labu Siam'), '2026-05-10', 4300),
  ((SELECT id FROM public.commodities WHERE name = 'Labu Siam'), '2026-05-15', 4400),
  ((SELECT id FROM public.commodities WHERE name = 'Labu Siam'), '2026-05-20', 4500),
  ((SELECT id FROM public.commodities WHERE name = 'Labu Siam'), '2026-05-25', 4500),

  -- Seledri
  ((SELECT id FROM public.commodities WHERE name = 'Seledri'), '2026-05-01', 16500),
  ((SELECT id FROM public.commodities WHERE name = 'Seledri'), '2026-05-05', 16000),
  ((SELECT id FROM public.commodities WHERE name = 'Seledri'), '2026-05-10', 15500),
  ((SELECT id FROM public.commodities WHERE name = 'Seledri'), '2026-05-15', 15200),
  ((SELECT id FROM public.commodities WHERE name = 'Seledri'), '2026-05-20', 15000),
  ((SELECT id FROM public.commodities WHERE name = 'Seledri'), '2026-05-25', 14000),

  -- Mangga
  ((SELECT id FROM public.commodities WHERE name = 'Mangga'), '2026-05-01', 19500),
  ((SELECT id FROM public.commodities WHERE name = 'Mangga'), '2026-05-05', 20000),
  ((SELECT id FROM public.commodities WHERE name = 'Mangga'), '2026-05-10', 20500),
  ((SELECT id FROM public.commodities WHERE name = 'Mangga'), '2026-05-15', 21000),
  ((SELECT id FROM public.commodities WHERE name = 'Mangga'), '2026-05-20', 21500),
  ((SELECT id FROM public.commodities WHERE name = 'Mangga'), '2026-05-25', 22000),

  -- Pisang
  ((SELECT id FROM public.commodities WHERE name = 'Pisang'), '2026-05-01', 13500),
  ((SELECT id FROM public.commodities WHERE name = 'Pisang'), '2026-05-05', 13200),
  ((SELECT id FROM public.commodities WHERE name = 'Pisang'), '2026-05-10', 12900),
  ((SELECT id FROM public.commodities WHERE name = 'Pisang'), '2026-05-15', 12700),
  ((SELECT id FROM public.commodities WHERE name = 'Pisang'), '2026-05-20', 12500),
  ((SELECT id FROM public.commodities WHERE name = 'Pisang'), '2026-05-25', 12000),

  -- Jeruk
  ((SELECT id FROM public.commodities WHERE name = 'Jeruk'), '2026-05-01', 16000),
  ((SELECT id FROM public.commodities WHERE name = 'Jeruk'), '2026-05-05', 16500),
  ((SELECT id FROM public.commodities WHERE name = 'Jeruk'), '2026-05-10', 17000),
  ((SELECT id FROM public.commodities WHERE name = 'Jeruk'), '2026-05-15', 17200),
  ((SELECT id FROM public.commodities WHERE name = 'Jeruk'), '2026-05-20', 17500),
  ((SELECT id FROM public.commodities WHERE name = 'Jeruk'), '2026-05-25', 18000),

  -- Pepaya
  ((SELECT id FROM public.commodities WHERE name = 'Pepaya'), '2026-05-01', 7000),
  ((SELECT id FROM public.commodities WHERE name = 'Pepaya'), '2026-05-05', 7200),
  ((SELECT id FROM public.commodities WHERE name = 'Pepaya'), '2026-05-10', 7300),
  ((SELECT id FROM public.commodities WHERE name = 'Pepaya'), '2026-05-15', 7400),
  ((SELECT id FROM public.commodities WHERE name = 'Pepaya'), '2026-05-20', 7500),
  ((SELECT id FROM public.commodities WHERE name = 'Pepaya'), '2026-05-25', 7500),

  -- Semangka
  ((SELECT id FROM public.commodities WHERE name = 'Semangka'), '2026-05-01', 7500),
  ((SELECT id FROM public.commodities WHERE name = 'Semangka'), '2026-05-05', 7200),
  ((SELECT id FROM public.commodities WHERE name = 'Semangka'), '2026-05-10', 7000),
  ((SELECT id FROM public.commodities WHERE name = 'Semangka'), '2026-05-15', 6700),
  ((SELECT id FROM public.commodities WHERE name = 'Semangka'), '2026-05-20', 6500),
  ((SELECT id FROM public.commodities WHERE name = 'Semangka'), '2026-05-25', 6000),

  -- Beras
  ((SELECT id FROM public.commodities WHERE name = 'Beras'), '2026-05-01', 12200),
  ((SELECT id FROM public.commodities WHERE name = 'Beras'), '2026-05-05', 12300),
  ((SELECT id FROM public.commodities WHERE name = 'Beras'), '2026-05-10', 12300),
  ((SELECT id FROM public.commodities WHERE name = 'Beras'), '2026-05-15', 12300),
  ((SELECT id FROM public.commodities WHERE name = 'Beras'), '2026-05-20', 12300),
  ((SELECT id FROM public.commodities WHERE name = 'Beras'), '2026-05-25', 12300),

  -- Jagung
  ((SELECT id FROM public.commodities WHERE name = 'Jagung'), '2026-05-01', 4700),
  ((SELECT id FROM public.commodities WHERE name = 'Jagung'), '2026-05-05', 4800),
  ((SELECT id FROM public.commodities WHERE name = 'Jagung'), '2026-05-10', 4900),
  ((SELECT id FROM public.commodities WHERE name = 'Jagung'), '2026-05-15', 5000),
  ((SELECT id FROM public.commodities WHERE name = 'Jagung'), '2026-05-20', 5000),
  ((SELECT id FROM public.commodities WHERE name = 'Jagung'), '2026-05-25', 5200),

  -- Bawang Merah
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Merah'), '2026-05-01', 28500),
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Merah'), '2026-05-05', 29000),
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Merah'), '2026-05-10', 30000),
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Merah'), '2026-05-15', 30500),
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Merah'), '2026-05-20', 30900),
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Merah'), '2026-05-25', 32000),

  -- Bawang Putih
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Putih'), '2026-05-01', 30000),
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Putih'), '2026-05-05', 29700),
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Putih'), '2026-05-10', 29500),
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Putih'), '2026-05-15', 29200),
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Putih'), '2026-05-20', 29000),
  ((SELECT id FROM public.commodities WHERE name = 'Bawang Putih'), '2026-05-25', 28500),

  -- Jahe
  ((SELECT id FROM public.commodities WHERE name = 'Jahe'), '2026-05-01', 13000),
  ((SELECT id FROM public.commodities WHERE name = 'Jahe'), '2026-05-05', 13500),
  ((SELECT id FROM public.commodities WHERE name = 'Jahe'), '2026-05-10', 14000),
  ((SELECT id FROM public.commodities WHERE name = 'Jahe'), '2026-05-15', 14200),
  ((SELECT id FROM public.commodities WHERE name = 'Jahe'), '2026-05-20', 14500),
  ((SELECT id FROM public.commodities WHERE name = 'Jahe'), '2026-05-25', 15000),

  -- Kopi Arabika
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Arabika'), '2026-05-01', 81000),
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Arabika'), '2026-05-05', 82000),
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Arabika'), '2026-05-10', 83000),
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Arabika'), '2026-05-15', 83500),
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Arabika'), '2026-05-20', 84000),
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Arabika'), '2026-05-25', 85000),

  -- Kopi Robusta
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Robusta'), '2026-05-01', 40000),
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Robusta'), '2026-05-05', 40500),
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Robusta'), '2026-05-10', 41000),
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Robusta'), '2026-05-15', 41200),
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Robusta'), '2026-05-20', 41500),
  ((SELECT id FROM public.commodities WHERE name = 'Kopi Robusta'), '2026-05-25', 42000),

  -- Kelapa Sawit
  ((SELECT id FROM public.commodities WHERE name = 'Kelapa Sawit'), '2026-05-01', 2550),
  ((SELECT id FROM public.commodities WHERE name = 'Kelapa Sawit'), '2026-05-05', 2600),
  ((SELECT id FROM public.commodities WHERE name = 'Kelapa Sawit'), '2026-05-10', 2650),
  ((SELECT id FROM public.commodities WHERE name = 'Kelapa Sawit'), '2026-05-15', 2700),
  ((SELECT id FROM public.commodities WHERE name = 'Kelapa Sawit'), '2026-05-20', 2750),
  ((SELECT id FROM public.commodities WHERE name = 'Kelapa Sawit'), '2026-05-25', 2800);
