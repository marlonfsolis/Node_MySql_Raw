SELECT
  r.name,
  r.description
FROM roles r
WHERE r.name = :name;


SELECT
  p.name,
  p.description
FROM permissionsRoles pr
INNER JOIN permissions p ON pr.permission_name = p.name
WHERE pr.role_name = :name;

