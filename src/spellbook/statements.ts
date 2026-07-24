export const cellsWithRegionStmt = `SELECT 
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
      regions.region_name
    FROM cells 
    LEFT JOIN regions ON cells.region = regions.id 
    WHERE cells.id = ?
    `;
