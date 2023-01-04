
DROP TEMPORARY TABLE IF EXISTS permissionsRoles_temp;
CREATE TEMPORARY TABLE permissionsRoles_temp
  SELECT r.permission_name FROM permissionsRoles r WHERE r.role_name = :name;


DELETE
  FROM permissionsRoles
  WHERE role_name = :name;


UPDATE roles
SET name = :newName,
    description = :newDescription
WHERE name = :name;

/*Testing the transaction rollback*/
/*
SIGNAL SQLSTATE '12345'
  SET MESSAGE_TEXT = 'An error occurred';
*/

INSERT INTO permissionsRoles(role_name, permission_name)
  SELECT :newName, rt.permission_name FROM permissionsRoles_temp rt;


SELECT r.name,
       r.description
FROM roles r
WHERE r.name = :newName;

