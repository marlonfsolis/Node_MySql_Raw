
/* Delete first the associations permissionsRoles */
DELETE FROM permissionsRoles WHERE role_name = :name;

/* Delete the role now */
DELETE FROM roles WHERE name = :name;
