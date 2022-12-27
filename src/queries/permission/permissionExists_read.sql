SELECT
  1 AS itExists
FROM permissions p
WHERE name = :name
LIMIT 1;
