SELECT
  1 AS itExists
FROM roles r
WHERE name = :name
LIMIT 1;
