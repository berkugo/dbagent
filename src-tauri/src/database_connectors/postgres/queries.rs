pub const GET_SCHEMAS: &str = "
    SELECT schema_name 
    FROM information_schema.schemata 
    WHERE schema_name NOT LIKE 'pg_%' 
    AND schema_name != 'information_schema'
";

pub const DEBUG_TABLES: &str = "
    SELECT schemaname, tablename, tableowner 
    FROM pg_catalog.pg_tables 
    WHERE schemaname NOT LIKE 'pg_%' 
    AND schemaname != 'information_schema'
";

pub const GET_TABLES: &str = "
    SELECT n.nspname as schema_name,
           c.relname as table_name,
           CASE c.relkind 
               WHEN 'r' THEN 'table'
               WHEN 'v' THEN 'view'
               WHEN 'm' THEN 'materialized view'
               ELSE c.relkind::text 
           END as table_type
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = $1
    AND c.relkind = 'r'
    AND NOT EXISTS (
        SELECT 1 FROM pg_catalog.pg_depend d
        WHERE d.objid = c.oid
        AND d.deptype = 'e'
    )
";

pub const GET_FUNCTIONS: &str = "
    SELECT 
        n.nspname as schema,
        p.proname as name,
        pg_get_function_result(p.oid) as return_type,
        pg_get_function_arguments(p.oid) as arguments
    FROM pg_proc p 
    LEFT JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = $1
";

pub const GET_COLUMNS: &str = "
SELECT 
    a.attname as column_name,
    format_type(a.atttypid, a.atttypmod) as data_type,
    a.attnotnull as is_not_null,
    (SELECT EXISTS (
        SELECT 1 FROM pg_constraint c 
        WHERE c.conrelid = a.attrelid 
        AND c.conkey[1] = a.attnum 
        AND c.contype = 'p'
    )) as is_primary_key,
    (SELECT EXISTS (
        SELECT 1 FROM pg_constraint c 
        WHERE c.conrelid = a.attrelid 
        AND a.attnum = ANY(c.conkey) 
        AND c.contype = 'f'
    )) as is_foreign_key,
    d.description
FROM 
    pg_attribute a
    LEFT JOIN pg_description d ON d.objoid = a.attrelid AND d.objsubid = a.attnum
    LEFT JOIN pg_class c ON c.oid = a.attrelid
    LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE 
    n.nspname = $1
    AND c.relname = $2
    AND a.attnum > 0
    AND NOT a.attisdropped
ORDER BY 
    a.attnum;
";

pub const GET_ROW_COUNT: &str = "SELECT COUNT(*) FROM {}.{}";
pub const GET_ROWS: &str = "SELECT * FROM {}.{} LIMIT $1 OFFSET $2"; 