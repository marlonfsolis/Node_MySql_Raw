SELECT
  r.name,
  r.description
FROM roles r
WHERE r.name = :name
LIMIT 1;
