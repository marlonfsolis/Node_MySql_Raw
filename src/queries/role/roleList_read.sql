SELECT r.name,
       r.description
FROM roles r
WHERE (IFNULL(:name,'') = '' OR r.name = :name)
AND (IFNULL(:description,'') = '' OR r.description = :description)
AND (IFNULL(:name_s,'') = '' OR r.name LIKE :name_s)
AND (IFNULL(:description_s,'') = '' OR r.description LIKE :description_s)
LIMIT :fetchRows
OFFSET :offsetRows;
