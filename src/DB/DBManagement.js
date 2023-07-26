import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import {Confuguration} from '../configuration/conf';// надо будет сделать

export const checkExistenceDB = async dbName => {
    const dbDir = FyleSystem.documentDirectory + 'SQLite/';
    const dirInfo = await FileSystem.getInfoAsync(dbDir+dbName);
    if(!dirInfo.exists) return false
    else return true
}

export async function createDatabase(dbName) {
    const db = await SQLite.openDatabase(dbName);
    db.transaction(tx => {
        tx.executeSql(`
        CREATE TABLE "mytest"
        (
            "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "question" TEXT
        )
        `)
    }), error => console.log(`create error: ${error}`);

    console.log('table created');
}

export async function select(dbName) {
    const db = SQLite.openDatabase(dbName);
    db.transaction(tx => {
        tx.executeSql(
            'SELECT = FROM mytest',
            [],
            (_, {rows}) => {
                console.log(JSON.stringify(rows));
                //console.log(rows._array);
            }
        )
    }), error => console.log(`select error: ${error}`);
}

export async function insertInfo(dbName, question="", answer="") {
    const dirInfo = await checkExistenceDB(dbName);
    if (!dirInfo) await createDatabase(dbName);
    const db = SQLite.openDatabase(dbName);
    db.transaction( tx => {
        tx.executeSql(`
        INSERT INTO mytest (question, answer)
        values ('${question}', '${answer}')
        `)
    }), error => console.log(`insert error: ${error}`);
}


export async function updateData(dbName, id, question="", answer=""){
    const db = SQLite.openDatabase(dbName);
    db.transaction(tx => {
        tx.executeSql(`
        UPDATE mytest SET question = "'${question}", answer = "${answer}"
        WHERE id = "${id}"
        `)
    }), error => console.log(`update error: ${error}`);
}


export async function deleteDB(dbName) {
    const dbDir = FyleSystem.documentDirectory + 'SQLite/';
    const dirInfo = await FileSystem.getInfoAsync(dbDir+dbName);
    if(dirInfo.exists) = await FyleSystem.deleteAsync(dbDir+dbName, {idempotent: true});
    
    console.log('table deleted');
}