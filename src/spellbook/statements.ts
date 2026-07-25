export const cellWithEverything = `SELECT 
    cells.id,
    cells.map_id,
    cells.x,
    cells.y,
    cells.map_link,
    cells.location,
    cells.structure_image,
    cells.description,
    cells.created_at,
    cells.updated_at,
    cells.deleted_at,
    locations.color,
    locations.location_name,
    locations.description
FROM cells 
LEFT JOIN locations ON cells.location = locations.id
WHERE cells.id = ?`;

export const cellsForMapWithEverythingStmt = `SELECT 
    cells.id,
    cells.map_id,
    cells.x,
    cells.y,
    cells.map_link,
    cells.location,
    cells.structure_image,
    cells.description,
    cells.created_at,
    cells.updated_at,
    cells.deleted_at,
    locations.color,
    locations.location_name,
    locations.description
FROM cells 
LEFT JOIN locations ON cells.location = locations.id
WHERE map_id = ?`;
