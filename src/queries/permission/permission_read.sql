SELECT
  p.name,
  p.description
FROM permissions p
WHERE p.name = :name
LIMIT 1;
