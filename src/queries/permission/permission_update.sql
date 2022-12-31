/* This is a valid comment */
UPDATE permissions p
SET name = :newName,
    description = :newDescription
WHERE p.name = :name;

SELECT
  p.name,
  p.description
FROM permissions p
WHERE p.name = :newName
LIMIT 1;
