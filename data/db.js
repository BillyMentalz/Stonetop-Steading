import { DatabaseSync } from 'node:sqlite';

const database = new DatabaseSync('./main.db');
const initDatabase = `

CREATE TABLE IF NOT EXISTS homes (
    homeName TEXT PRIMARY KEY,
    homeImage TEXT,
    latestModified TEXT NOT NULL
);

INSERT OR IGNORE INTO homes (homeName, latestModified) VALUES 
('At World''s End',CURRENT_TIMESTAMP),
('Vicinity',CURRENT_TIMESTAMP),
('Stonetop', CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS homesRestrict (
    homeName TEXT PRIMARY KEY,
    FOREIGN KEY (homeName) REFERENCES homes(homeName) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS stats (
    statName TEXT PRIMARY KEY,
    statType TEXT CHECK( statType IN ('radio','select-one','number','checkbox' )) NOT NULL,
    statOptions TEXT,
    statValue TEXT NOT NULL DEFAULT '0',
    latestModified TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS statsRestrict (
    statName TEXT PRIMARY KEY,
    FOREIGN KEY (statName) REFERENCES stats(statName) ON DELETE RESTRICT
);

INSERT OR IGNORE INTO stats (statName,statType, statOptions, statValue, latestModified) VALUES 
('Fortunes','radio','-1,+0,+1,+2,+3', '+1',CURRENT_TIMESTAMP),
('Surplus','radio','-1,+0,+1,+2,+3','+1',CURRENT_TIMESTAMP),
('Prosperity','radio','-1,+0,+1,+2,+3','+0',CURRENT_TIMESTAMP),
('Defenses','radio','-1,+0,+1,+2,+3','+0',CURRENT_TIMESTAMP),
('Stonetop-Size', 'select-one','Hamlet,Village,Town,City', 'Village',CURRENT_TIMESTAMP),
('Population', 'number', '', '311',CURRENT_TIMESTAMP),
('Silver-Purses', 'number','', '0',CURRENT_TIMESTAMP),
('Silver-Handfuls', 'number','', '0',CURRENT_TIMESTAMP),
('Silver-Coins', 'number','', '0',CURRENT_TIMESTAMP),
('Gold-Purses', 'number','', '0',CURRENT_TIMESTAMP),
('Gold-Handfuls', 'number','', '0',CURRENT_TIMESTAMP),
('Gold-Coins', 'number','', '0',CURRENT_TIMESTAMP),
('Season', 'select-one','Spring,Summer,Autumn,Winter', 'Spring',CURRENT_TIMESTAMP),
('Diminished', 'checkbox','', 'false',CURRENT_TIMESTAMP),
('Lacking', 'checkbox','', 'false',CURRENT_TIMESTAMP),
('Malcontent', 'checkbox','', 'false',CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO statsRestrict (statName) VALUES 
('Fortunes'),
('Surplus'),
('Prosperity'),
('Defenses'),
('Stonetop-Size'), 
('Population'),
('Silver-Purses'),
('Silver-Handfuls'),
('Silver-Coins'), 
('Gold-Purses'), 
('Gold-Handfuls'), 
('Gold-Coins'),
('Season'), 
('Diminished'),
('Lacking'), 
('Malcontent');

CREATE TABLE IF NOT EXISTS lists (
    listName TEXT NOT NULL,
    listOrder INTEGER NOT NULL,
    listText TEXT,
    latestModified TEXT NOT NULL,
    PRIMARY KEY (listName, listOrder)
);

INSERT OR IGNORE INTO lists (listName, listOrder, listText, latestModified) VALUES
('Resources', 1, 'Farming (beans, potatoes ,oats, barley)',CURRENT_TIMESTAMP),
('Resources', 2, 'Hunting/trapping (fur,meat,hides)',CURRENT_TIMESTAMP),
('Resources', 3, 'Stone (collected from the Old Wall)',CURRENT_TIMESTAMP),
('Resources', 4, 'Cistern (filled with rain, snow)',CURRENT_TIMESTAMP),
('Resources', 5, 'Tradesfolk (midwife, potter, publican,smith,tanner)',CURRENT_TIMESTAMP),
('Resources', 6, 'Trade: Gordin''s Delve (metal tools)',CURRENT_TIMESTAMP),
('Resources', 7, 'Trade: Marshedge (textiles, herbs, glass)',CURRENT_TIMESTAMP),
('Fortifications', 1, 'Village militia',CURRENT_TIMESTAMP),
('Fortifications', 2, 'The Ringwall (low,stone)',CURRENT_TIMESTAMP),
('Fortifications', 3, '3 watchtowers',CURRENT_TIMESTAMP),
('Fortifications', 4, 'Spears & shields in every home',CURRENT_TIMESTAMP),
('Fortifications', 5, 'Some bows',CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS characters (
    characterId  TEXT PRIMARY KEY,
    characterHome TEXT NOT NULL DEFAULT 'At World''s End' REFERENCES homes(homeName) ON DELETE SET DEFAULT,
    characterName TEXT NOT NULL,
    characterImage TEXT NOT NULL DEFAULT 'characters/NPC.png',
    characterPronouns TEXT, 
    characterProfession TEXT,
    characterTraits TEXT,
    characterInfo TEXT,
    characterCreationDate TEXT NOT NULL,
    latestModified TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS locations (
    locationHome TEXT NOT NULL,
    locationId TEXT NOT NULL,
    locationSignifier TEXT NOT NULL,
    locationName TEXT NOT NULL,
    locationInfo TEXT ,
    latestModified TEXT NOT NULL,
    FOREIGN KEY (locationHome) REFERENCES homes(homeName),
    PRIMARY KEY (locationHome, locationId),
    UNIQUE(locationHome, locationId, locationSignifier)
);

CREATE TABLE IF NOT EXISTS markers (
    markerHome TEXT NOT NULL,
    markerId TEXT NOT NULL,
    markerOrder INTEGER NOT NULL, 
    markerSignifier TEXT NOT NULL,
    markerX REAL NOT NULL DEFAULT 0,
    markerY REAL NOT NULL DEFAULT 0,
    latestModified TEXT NOT NULL,
    FOREIGN KEY (markerHome, markerId, markerSignifier) REFERENCES locations(locationHome, locationId, locationSignifier)ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (markerHome, markerId, markerSignifier, markerOrder)
);

CREATE TABLE IF NOT EXISTS deleteRecords (
    tableName TEXT NOT NULL,
    deletedItem TEXT NOT NULL,
    deletedAt TEXT NOT NULL, 
    PRIMARY KEY (tableName, deletedItem, deletedAt)
);

CREATE TABLE IF NOT EXISTS lastTimeSync (
    tableName TEXT PRIMARY KEY,
    syncTimeStamp TEXT NOT NULL
);

INSERT OR IGNORE INTO lastTimeSync ( tableName , syncTimeStamp) VALUES
('homes', CURRENT_TIMESTAMP),
('stats', CURRENT_TIMESTAMP),
('lists', CURRENT_TIMESTAMP),
('characters', CURRENT_TIMESTAMP),
('locations', CURRENT_TIMESTAMP),
('markers', CURRENT_TIMESTAMP),
('deleteRecords', CURRENT_TIMESTAMP);
`;
try {
    database.exec('PRAGMA foreign_keys = ON;');
    database.exec('BEGIN;');
    database.exec(initDatabase);
    database.exec('COMMIT;');
}
catch (e) {
    database.exec('ROLLBACK;');
    console.log(e.message);
    throw e;
}
export default database;
