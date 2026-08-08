// TODO: query is very slow because we're joining on cells and maps just to get the map name for the linked map. Look into a WITH
const cellBaseQuery = `SELECT 
    cells.id,
    cells.map_id AS map_id,
    cells.x,
    cells.y,
    cells.cell_link,
    map_name.linked_map_name AS map_link,
    cells.location,
    cells.structure_image,
    cells.description,
    cells.created_at,
    cells.updated_at,
    cells.deleted_at,
    locations.color,
    locations.location_name,
    locations.description as location_description,
    json_group_array(DISTINCT npws.wizard_name) as wizard_names,
    json_group_array(DISTINCT items.item_name) as item_names
FROM cells 
LEFT JOIN locations ON cells.location = locations.id
LEFT JOIN npws ON cells.id = npws.cell_id
LEFT JOIN items ON cells.id = items.cell_id
LEFT JOIN (
  SELECT name AS linked_map_name, cells.id AS cell_id 
  FROM maps 
  LEFT JOIN cells ON cells.map_id = maps.id  
) AS map_name ON cells.cell_link = map_name.cell_id
`;

// GROUP BY must come after WHERE in SQLite
export const cellWithEverything = `${cellBaseQuery}
WHERE cells.id = ?
GROUP BY cells.id;`;
export const cellsForMapWithEverythingStmt = `${cellBaseQuery}
WHERE cells.map_id = ?
GROUP BY cells.id;`;

export const npwsStmt = `SELECT * FROM npws`;
export const npwStmt = `${npwsStmt} WHERE wizard_name = ?`;

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

export const magicItemsStmt = `SELECT * FROM items`;

export const magicItemStmt = `${magicItemsStmt} WHERE item_name = ?`;

export const updateMagicItemStmt = `
UPDATE items
SET 
    cell_id = ?,
    facts = ?,
    rarity = ?
WHERE item_name = ?
RETURNING *;
`;

export const createMagicItemStmt = `
INSERT INTO items (item_name, cell_id, facts, rarity)
VALUES (?, ?, ?, ?)
RETURNING *;
`;
