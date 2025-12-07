SELECT
    tc.constraint_name, tc.table_name, kcu.column_name
FROM 
    information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY'
