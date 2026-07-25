export const cellWithEverything = `SELECT 
    cells.id,
    cells.map_id,
    cells.x,
    cells.y,
    cells.map_link,
    cells.region,
    cells.nature,
    cells.description,
    cells.created_at,
    cells.updated_at,
    cells.deleted_at,
    regions.color,
    regions.region_name,
    structures.type as structure
FROM cells 
LEFT JOIN regions ON cells.region = regions.id
LEFT JOIN structures ON cells.id = structures.cell_id 
WHERE cells.id = ?`;

export const cellsForMapWithEverythingStmt = `SELECT 
    cells.id,
    cells.map_id,
    cells.x,
    cells.y,
    cells.map_link,
    cells.region,
    cells.nature,
    cells.description,
    cells.created_at,
    cells.updated_at,
    cells.deleted_at,
    regions.color,
    regions.region_name,
    structures.type as structure
FROM cells 
LEFT JOIN regions ON cells.region = regions.id
LEFT JOIN structures ON cells.id = structures.cell_id 
 WHERE map_id = ?`;
