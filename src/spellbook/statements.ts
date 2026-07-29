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

export const npwsStmt = `SELECT * FROM npws;`;

export const updateNPWStmt = `
UPDATE npws
SET 
    cell_id = ?,
    wizard_class = ?,
    HP = ?,
    facts = ?
WHERE wizard_name = ?
RETURNING *;
`;

export const createNPWStmt = `
INSERT INTO npws (wizard_name, cell_id, wizard_class, HP, facts)
VALUES (?, ?, ?, ?, ?)
RETURNING *;
`;
