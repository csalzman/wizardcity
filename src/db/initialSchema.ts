const schema = `
CREATE TABLE IF NOT EXISTS wizards (
    id INTEGER PRIMARY KEY,
    wizard_name TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL UNIQUE,
    HP INTEGER,
    facts TEXT,
    created_at created_at INTEGER DEFAULT (unixepoch()),
    updated_at created_at INTEGER DEFAULT (unixepoch()),
    deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS maps (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at created_at INTEGER DEFAULT (unixepoch()),
    updated_at created_at INTEGER DEFAULT (unixepoch()),
    deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS cells (
    id INTEGER PRIMARY KEY,
    map_id INTEGER NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    map_link TEXT,
    region INTEGER,
    nature TEXT,
    description TEXT,
    created_at created_at INTEGER DEFAULT (unixepoch()),
    updated_at created_at INTEGER DEFAULT (unixepoch()),
    deleted_at TEXT,
    -- TODO: should this be replace instead?
    UNIQUE(map_id, x, y) ON CONFLICT IGNORE
);

CREATE TABLE IF NOT EXISTS buildings (
    id INTEGER PRIMARY KEY,
    cell_id INTEGER,
    type TEXT,
    created_at created_at INTEGER DEFAULT (unixepoch()),
    updated_at created_at INTEGER DEFAULT (unixepoch()),
    deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS npws (
    id INTEGER PRIMARY KEY,
    wizard_name TEXT NOT NULL UNIQUE,
    cell_id INTEGER,
    class TEXT,
    HP INTEGER,
    facts TEXT,
    created_at created_at INTEGER DEFAULT (unixepoch()),
    updated_at created_at INTEGER DEFAULT (unixepoch()),
    deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    item_name TEXT NOT NULL UNIQUE,
    cell_id INTEGER,
    facts TEXT,
    created_at created_at INTEGER DEFAULT (unixepoch()),
    updated_at created_at INTEGER DEFAULT (unixepoch()),
    deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS regions (
    id INTEGER PRIMARY KEY,
    region_name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at created_at INTEGER DEFAULT (unixepoch()),
    updated_at created_at INTEGER DEFAULT (unixepoch()),
    deleted_at TEXT
);`;

export default schema;
