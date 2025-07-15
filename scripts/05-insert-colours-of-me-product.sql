INSERT INTO products (title, description, price, stock, category, author, image_url)
VALUES (
  'Colours of me',
  'Colours of Me is a gorgeous story of children''s identity that goes beyond storytelling. It nurtures the heart, stretches the mind, and reflects the soul. These are stories written to inspire, empower, and guide children through emotional discovery, cultural pride, and self-worth. This beautifully illustrated book helps children understand their feelings, stand firm in who they are, and express themselves with confidence and kindness. Rooted in African heritage, it celebrates diversity while teaching universal values of self-acceptance and emotional intelligence.',
  1700,
  50, -- Example stock count
  'Children''s Book',
  'Cheryl Nyakio',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_tcb92abNrggWRHCHBwQfify7gNeT/Y3OUVjtqEYTf-OV8Lq-wPi/public/Colours%20Of%20Me%20Front.jpg' -- Use your actual image URL
)
ON CONFLICT (title) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  category = EXCLUDED.category,
  author = EXCLUDED.author,
  image_url = EXCLUDED.image_url;
