import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';

const dbExists = fs.existsSync('./main.db');
const database = new DatabaseSync('./main.db');
const initDatabase = `
CREATE TABLE IF NOT EXISTS homes (
    homeId INTEGER PRIMARY KEY,
    homeName TEXT NOT NULL UNIQUE,
    homeImage TEXT DEFAULT "maps/Mystery.png",
    homeTagLine TEXT DEFAULT "...",
    latestModified TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS homesRestrict (
    homeId INTEGER PRIMARY KEY,
    FOREIGN KEY (homeId) REFERENCES homes(homeId) ON DELETE RESTRICT
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

CREATE TABLE IF NOT EXISTS lists (
    listOrder INTEGER PRIMARY KEY,
    listName TEXT NOT NULL,
    listText TEXT,
    latestModified TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS characters (
    characterId INTEGER PRIMARY KEY,
    characterHome INTEGER NOT NULL DEFAULT 1 REFERENCES homes(homeId) ON DELETE SET DEFAULT,
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
    locationId INTEGER PRIMARY KEY,
    locationHome INTEGER NOT NULL,
    locationName TEXT NOT NULL,
    locationSignifier TEXT NOT NULL,
    locationInfo TEXT,
    latestModified TEXT NOT NULL,
    FOREIGN KEY (locationHome) REFERENCES homes(homeId) ON DELETE CASCADE,
    UNIQUE(locationId, locationHome)
);

CREATE TABLE IF NOT EXISTS markers (
    markerHome INTEGER NOT NULL,
    markerId INTEGER NOT NULL,
    markerOrder INTEGER NOT NULL, 
    markerX REAL NOT NULL DEFAULT 0,
    markerY REAL NOT NULL DEFAULT 0,
    latestModified TEXT NOT NULL,
    FOREIGN KEY (markerHome, markerId) REFERENCES locations(locationHome, locationId) ON DELETE CASCADE,
    PRIMARY KEY (markerHome, markerId, markerOrder)
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

const initialInsert = `
INSERT OR IGNORE INTO homes (homeId,homeName, homeImage,homeTagLine, latestModified) VALUES 
(1, 'At World''s End', 'maps/AtWorldsEnd.png','What can this world offer?',CURRENT_TIMESTAMP),
(2, 'Vicinity', 'maps/Vicinity.png','What lays beyond the walls?', CURRENT_TIMESTAMP),
(3, 'Stonetop', 'maps/Stonetop.png','Ah, home sweet home', CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO homesRestrict(homeId) VALUES 
(1),
(2),
(3);

INSERT OR IGNORE INTO lists (listName, listText, latestModified) VALUES
('Resources', 'Farming (beans, potatoes ,oats, barley)',CURRENT_TIMESTAMP),
('Resources', 'Hunting/trapping (fur,meat,hides)',CURRENT_TIMESTAMP),
('Resources', 'Stone (collected from the Old Wall)',CURRENT_TIMESTAMP),
('Resources', 'Cistern (filled with rain, snow)',CURRENT_TIMESTAMP),
('Resources', 'Tradesfolk (midwife, potter, publican,smith,tanner)',CURRENT_TIMESTAMP),
('Resources', 'Trade: Gordin''s Delve (metal tools)',CURRENT_TIMESTAMP),
('Resources', 'Trade: Marshedge (textiles, herbs, glass)',CURRENT_TIMESTAMP),
('Fortifications', 'Village militia',CURRENT_TIMESTAMP),
('Fortifications', 'The Ringwall (low,stone)',CURRENT_TIMESTAMP),
('Fortifications', '3 watchtowers',CURRENT_TIMESTAMP),
('Fortifications', 'Spears & shields in every home',CURRENT_TIMESTAMP),
('Fortifications', 'Some bows',CURRENT_TIMESTAMP);

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

INSERT OR IGNORE INTO lastTimeSync ( tableName , syncTimeStamp) VALUES
('homes', CURRENT_TIMESTAMP),
('stats', CURRENT_TIMESTAMP),
('lists', CURRENT_TIMESTAMP),
('characters', CURRENT_TIMESTAMP),
('locations', CURRENT_TIMESTAMP),
('markers', CURRENT_TIMESTAMP),
('deleteRecords', CURRENT_TIMESTAMP);
`

try {
    database.exec('PRAGMA foreign_keys = ON;');
    database.exec('BEGIN;');
    database.exec(initDatabase);
    if (!dbExists) database.exec(initialInsert);
    database.exec('COMMIT;');
}
catch (e) {
    database.exec('ROLLBACK;');
    console.log(e.message);
    throw e;
}
export default database;
