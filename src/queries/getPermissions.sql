set @name = ?;
set @description = ?;

SELECT
  name,
  description
FROM permissions
WHERE (IFNULL(@name,'')='' OR name = @name)
AND (IFNULL(@description,'')='' OR description = @description);
