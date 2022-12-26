SELECT
  name,
  description
FROM permissions p
WHERE (IFNULL(:name,'')='' OR p.name = :name)
AND (IFNULL(:description,'')='' OR p.description = :description)
AND (IFNULL(:name_s,'')='' OR p.name LIKE :name_s)
AND (IFNULL(:description_s,'')='' OR p.description LIKE :description_s)
LIMIT :fetchRows
OFFSET 0
;
