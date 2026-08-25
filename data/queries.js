import database from './db.js';


const extractFields  = (payload, fieldNames) => {
    const info = [];
    fieldNames.forEach(item => {
        if(payload.hasOwnProperty(item) ){
           info.push(payload[item]);
        }
        else {
            throw new Error (`Data ${item} not in the payload during Extract Field`)
        }
    });
    return info;
}

const updateTime = database.prepare(`
    UPDATE lastTimeSync SET syncTimeStamp = datetime('now')
    WHERE tableName = ?
    RETURNING syncTimeStamp
`);


// THIS IS THE CREATION SECTION 

const insertSchemas = {
    'homes':{
        'statement': database.prepare(`INSERT INTO homes (homeName, latestModified) VALUES (?,?) RETURNING *`),
        'columns': ['name','time']
    },
    'stats': {
        'statement': database.prepare(`INSERT INTO stats(statName, statType, statOptions, statValue, latestModified) VALUES (?,?,?,?,?) RETURNING *`),
        'columns': ['name', 'type','options', 'value', 'time'] 
    },
    'lists': {
        'statement': database.prepare(`INSERT INTO lists (listName, listOrder, listText, latestModified) VALUES (?,?,?,?) RETURNING *`),
        'columns': ['name', 'order', 'text', 'time']
    },
    'characters':{
        'statement':database.prepare(`INSERT INTO characters (characterId, characterHome, characterName, characterPronouns, characterProfession,  characterTraits,  characterInfo, characterCreationDate ,latestModified) VALUES (?,?,?,?,?,?,?,?,?) RETURNING *`),
        'columns': ['id', 'home', 'name', 'pronouns', 'profession', 'traits',  'info', 'time','time']
    },
    'locations':{
        'statement':database.prepare(`INSERT INTO locations (locationHome, locationId, locationSignifier, locationName, locationInfo, latestModified) VALUES (?,?,?,?,?,?) RETURNING *`),
        'columns': ['home', 'signifier', 'name', 'text', 'time']
    }, 
    'markers':{
        'statement':database.prepare(`INSERT INTO markers (markerHome, markerId, markerSignifier, markerOrder, markerX, markerY, latestModified) VALUES (?,?,?,?,?,?,?) RETURNING *`),
        'columns':['home', 'signifier', 'order', 'x','y', 'time']
    } 
};

const createOperation = (creation) => {
    try {
        database.exec('BEGIN');
        creation['time'] = updateTime.get(creation.table).syncTimeStamp;
        const info = extractFields(creation, insertSchemas[creation.table].columns );
        const result = insertSchemas[creation.table].statement.get(...info);
        database.exec('COMMIT');
        return {
            'table': creation.table,
            'result': result
        };
    }
    catch (e) {
        database.exec('ROLLBACK');
        console.log(`createOperation failed.Paramters: ${e.message}`);
    }
}


// timeSync operations aka readSchemas
const checkSyncStatement = database.prepare(`SELECT tableName FROM lastTimeSync WHERE ? < syncTimeStamp`);
const syncSchemas = { 
    'homes': database.prepare('SELECT * FROM homes WHERE ? < latestModified ORDER BY homeName'),
    'stats': database.prepare('SELECT * FROM stats WHERE ? < latestModified ORDER BY statName'),
    'lists': database.prepare('SELECT * FROM lists WHERE ? < latestModified ORDER BY listName, listOrder'),
    'characters': database.prepare('SELECT * FROM characters WHERE ? < latestModified ORDER BY characterCreationDate'),
    'locations':database.prepare('SELECT * FROM locations  WHERE ? < latestModified ORDER BY locationHome, locationSignifier'),
    'markers':database.prepare('SELECT * FROM markers  WHERE ? < latestModified ORDER BY markerHome, markerSignifier, markerOrder, latestModified'),
    "deleteRecords":database.prepare(`SELECT * FROM deleteRecords WHERE ? < deletedAt `),
    'time': database.prepare(`SELECT CURRENT_TIMESTAMP`)
};

const syncOperation = (checkSync) => {
    try {
        const updates = {};
        const lastTimeStamps = checkSyncStatement.all(checkSync);
        for (const {tableName} of lastTimeStamps ) {
            const result = syncSchemas[tableName].all(checkSync); 
            if (result.length !== 0) updates[tableName] = result;
        }    
        updates['time'] = syncSchemas['time'].get().CURRENT_TIMESTAMP;
        return updates;
    } 
    catch (e) {
        throw new Error(`syncOperation failed: ${e.message}`)
    }
}

//update Operations 

const updateSchemas = {
    /*'homes': {
        'statement': database.prepare()
    },*/
    'stats': {
        'statement': database.prepare(`UPDATE stats SET statValue = ?, latestModified = ?  WHERE statName = ? AND statType = ? RETURNING *`),
        'columns': ['value','time', 'name','type']
    },
    'lists': {
        'statement':database.prepare(`UPDATE lists SET listText = ?, latestModified = ?  WHERE listName = ? AND listOrder =? RETURNING *`),
        'columns': ['text','time', 'name','order']
    },
    'characters':{
        'statement':database.prepare(`UPDATE characters 
        SET characterHome = ?, characterName = ?, characterPronouns = ?, characterProfession = ?, characterTraits = ?, characterInfo = ?, latestModified = ? 
        WHERE characterId = ? RETURNING *`),
        'columns': [ 'home', 'name', 'pronouns', 'profession', 'traits',  'info', 'time', 'id' ]
    },
    'locations':{
        'statement':database.prepare(`UPDATE locations SET locationName = ?, locationInfo = ?, latestModified = ? WHERE locationHome = ? AND locationId = ? RETURNING *`),
        'columns':['name','text','time', 'home', 'id']
    },
    'markers': {
        'statement': database.prepare(`UPDATE markers SET markerX = ? ,markerY = ?, latestModified = ? WHERE markerHome = ? AND markerId = ? AND markerOrder = ? RETURNING *`),
        'columns':['x', 'y','time', 'home', 'id', 'number']
    }
}

const updateOperation = (updates) => {
    try {
        database.exec('BEGIN');
        updates['time'] = updateTime.get(updates.table).syncTimeStamp;
        const info = extractFields(updates, updateSchemas[updates.table].columns);
        const result = updateSchemas[updates.table].statement.get(...info);
        database.exec('COMMIT');
        return {
            'table': updates.table,
            'result':result
        }
    }
    catch (e) {
        database.exec('ROLLBACK');
        console.log(e.message);
        return e; 
    }
}


const deleteSchemas  = {
    'homes':{
        'statement': database.prepare(`DELETE from homes WHERE homeName = ?`),
        'columns': ['name']
    },
    /* 'stats': {
        'statement': database.prepare(`DELETE from stats WHERE statName = ?`),
        'columns': ['name', 'type', 'value', 'time'] 
    },*/
    'lists': {
        'statement':database.prepare(`DELETE from lists WHERE listName = ? AND listOrder = ? RETURNING *`),
        'columns': ['name', 'order']
    },
    'characters':{
        'statement':database.prepare(`DELETE from characters WHERE characterId = ? RETURNING *`),
        'columns': ['id']
    },
    'locations':{
        'statement':database.prepare(`DELETE from locations WHERE locationHome = ? AND locationId = ? RETURNING *`),
        'columns': ['home','id']
    }, 
    'markers':{
        'statement':database.prepare(`DELETE from markers WHERE markerHome = ? AND markerId = ? AND markerOrder = ? RETURNING *`),
        'columns':['home','id', 'order']
    }
}
const deleteRecordExists = database.prepare(`SELECT EXISTS(SELECT 1 FROM deleteRecords WHERE tableName = ? AND deletedItem = ?) AS hasOld`);
const deleteRecordStatement  = database.prepare(`INSERT INTO deleteRecords (tableName, deletedItem, deletedAt) VALUES (?,?,?) RETURNING *`)
const deleteRecordUpdate = database.prepare(`UPDATE deleteRecords SET deletedAt = ? WHERE tableName = ? AND deletedItem = ? RETURNING *`);
const deleteOperation  = (deletion) => {
    try {
        database.exec('BEGIN');            
        const info = extractFields(deletion, deleteSchemas[deletion.table].columns);
        const time = updateTime.get('deleteRecords').syncTimeStamp;
        const result = deleteSchemas[deletion.table].statement.get(...info);
        const hasOld = deleteRecordExists.get(deletion.table, info.join('/%/'));
        console.log(hasOld)
        const deleteRecord = hasOld.hasOld ? deleteRecordUpdate.get(time, deletion.table , info.join('/%/')): deleteRecordStatement.get(deletion.table, info.join('/%/'), time);
        console.log(deleteRecord);
        database.exec('COMMIT');
        return deleteRecord;
        }
    catch (e) {
        database.exec('ROLLBACK');
        console.log(JSON.stringify(e))
        return e;
    }
}

export {
    createOperation,
    syncOperation,
    updateOperation,
    deleteOperation
}
