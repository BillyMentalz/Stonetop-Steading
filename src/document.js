import {updateIndicate} from './animation.js';
const socket = io();
const templates = document.getElementById('templates')
const sidebar = document.getElementById("sidebar");
const topbar = document.getElementById("topbar");
const guide = document.getElementById("guide");
const map = document.getElementById("map");
const guidebook = document.getElementById('guide');
const menu = document.getElementById('menu');
const maps = document.getElementById('worldMaps');
const characters = document.getElementById('characters');
const locations = document.getElementById('locations');
const assets = document.getElementById('assets');
const addBox = document.getElementById('addBox');
const characterInfo = document.getElementById('characterInfo');

class Node {
    constructor(element){
    this.element = element;
    this.prev = null;
    this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null
        this.end = this.head;
    }
    append(element) {
        let newNode = new Node(element);
        if (!this.head){
            this.head = newNode;
            this.end = newNode;
        } 
        else {
            newNode.prev = this.end;
            this.end.next = newNode;
            this.end = newNode;
        }
        element.__nodeRef = newNode;
        return newNode
    }
    popNode(node) {
        if(!this.head)return;
        if (this.head === node) {
            this.head = node.next;
            if (this.head) this.head.prev = null;
            if (node === this.end) this.end = null;
        }
        else {
            if (node.prev) node.prev.next = node.next;
            if (node.next) node.next.prev = node.prev;
            if (node === this.end) this.end = node.prev;
        }
        if (node.element) delete node.element.__nodeRef;
        return node
    }
};

/* Something possessed me to make the dataset a class with these clear defined structures. Which does have its uses, but I spend nearly a week 
 * and a half just grappling with design choices that were mostly overenginnerd and overcomplicated and over optimized. The class tool here is not the best 
 * but think of it as a Kalishnokov of a solution for taking data, creating, updating, deleting accordingly. The stuff from the backend DB is just reiterated here in json, 
 * and marked by index for ease of retrieval: You take row, you get a unique index, you search table for index, easy peasy. 
 * Now, my smartass created the backend database with composite keys and referential data between tables that aren't primary keys as well, 
 * so the following class doesn't really do the help if someone decides to update the primary key in an upstream table 
 * and then cascade it downward: No if you update the primary key get fucked. It's not robust and I hate it. Oh,
 * and I gotta make an saving mechanism I guess. Wait, I figured it out. 
 */
class graphNode {
    constructor(name , identifiers,  children, cascadeRules, createOperator, updateOperator, deleteOperator ) {
        this.table = {};
        this.name = name;
        this.identifiers = identifiers; 
        this.children = children;
        this.cascadeRules = cascadeRules;
        this.createOperator = createOperator;
        this.updateOperator = updateOperator;
        this.deleteOperator = deleteOperator;
    }
    makeIndex (row) {
        const index = this.identifiers.map(
            (item)=> { return row[item];}
        ).join('/%/');
        return index;
    };
    createRow(row) { // Remember to add wrappers on Deparsing and Time 
        const index = this.makeIndex(row);
        const element = this.createOperator(index, row);
        row.element = element;
        this.table[index] = row;
        updateIndicate(element);
    };
    updateRow(updateValue) {
        const index = this.makeIndex(updateValue);
        const row = this.table[index];
        if (!row) throw Error(`${row} does not exist!`);
        for (const [key,value] in Object.entries(updateValue)) {row[key] = value };
        this.updateOperator(row);
        updateIndicate(row.element);
        for (const cascadent in this.cascade) {
            cascadent.updateCascade(this.name , row);
        }
    };
    updateCascade(src, updateValue){
        const rules = this.cascadeRules[src];
        if (!rules) throw Error('cascadeRules mismatch!');
        const ghostIndex = rules.ghostIndex.map(i => 
            {return updateValue[i]}
        ).join('/%/');
        const resultValue = {};
        for ( let i = 0; i < rules.needValues.length ; i++ ) {
            resultValue[rules.changeValue[i]] = updateValue[rules.needValues[i]];
        }
        for ( const [key, pair] of Object.entries(this.table)) {
            if (key.startsWith(ghostIndex)) {
                for( const [subkey, subvalue] of Object.entries(resultValue)){
                    pair[subkey] = subvalue;
                }
                this.updateOperator(pair);
                updateIndicate(pair.element);
                for (const cascadent in this.cascade) {
                    cascadent.updateCascade(this.name , pair);
                }
            }
        } // This code doesn't actually think about what change. So basically, even if there is no change in the child, it treats it as having changed. 
    };
    deleteRow(deletedItem) {
        const row = this.table[deletedItem]
        this.deleteOperator(row);
        delete this.table[deletedItem];
        for ( const thing of this.cascade ){
            thing.deleteCascade(deletedItem);
        };
        
    };
    deleteCascade(id){
        for ( const [key, value] of Object.entries(this.table)){
            if (key.startsWith(id)) {
                this.deleteRow(key);
                for ( const cascadent in this.cascade) {
                    cascadent.graphNode.deleteCascade(key);
                }
            };
        }
        /* A known bug that I know might happen at some point is when a location is nuked, 
         * the character doesn't update to homeless. What this means is that the character may be editable with a location that no longer exists which will have a backend 
         * constraint error but I'm just letting that silently happen. It's up to players to readd a the characters place of Operations.
         */
    };
}
export { 
    LinkedList,
    graphNode,
    socket,
    templates,
    sidebar,  
    topbar, 
    guide,
    map,
    guidebook,
    menu,
    maps,
    characters,
    locations,
    assets,
    addBox,
    characterInfo,
    };
