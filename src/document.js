import {updateIndicate} from './animation.js';
const socket = io();
const addBoxTemplate = document.getElementById('addBoxTemplate');
const maps = document.getElementById('worldMaps');
const characters = document.getElementById('characters');

class UpdatingFromServerState {
    constructor(){
        this.isUpdatingFromServer = 0;
    }
    stepUp(){
        this.isUpdatingFromServer++;
    }
    stepDown() {
        this.isUpdatingFromServer--;
    }
    check() {
        if (this.isUpdatingFromServer > 0) return true;
        else return false;
    }
}

const isUpdatingFromServerState = new UpdatingFromServerState();


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

/*
class Row {
    constructor(node, data, element) {
        this.node = node; 
        this.data = data; 
        this.element = element;
        this.subscribers  = {};
    }
    update() {

    }
    delete() {

    }
    observe (isDelete , thing) {

    }
    
}
*/
const makeIndex  = (requirements, row) => {
        const index = requirements.map(item=>row[item]).join('/%/');
        return index;
}
class graphNode {
    constructor(name , identifiers, children, onDelete, createOperator, updateOperator, deleteOperator, attachElement ) {
        this.table = {};
        this.name = name;
        this.identifiers = identifiers; 
        this.children = children;
        this.onDelete = onDelete
        this.createOperator = createOperator;
        this.updateOperator = updateOperator;
        this.deleteOperator = deleteOperator;
        if (attachElement) {
            this.attachElement = document.getElementById(attachElement);
            this.attachElement.__graphNodeRef = this; 
        }
    }

    createRow(row) { 
        const index = makeIndex( this.identifiers, row);
        const element = this.createOperator(row);
        element.__rowReference = row;
        row.element = element;
        this.table[index] = row;
        updateIndicate(element);
    };

    updateRow(updateValue) {
        const index = makeIndex(this.identifiers, updateValue);
        const row = this.table[index];
        if (!row) throw Error(`${row} does not exist!`);
        for (const [key,value] of Object.entries(updateValue))  {
            row[key] = value 
        }
        const element = this.updateOperator(row);
        element.__rowReference = row;
        row.element = element;
        updateIndicate(row.element);
        
    };

    deleteRow(deletedItem) {
        const row = this.table[deletedItem]
        if (!row) return;
        if (row.latestModified > deletedItem.deletedAt) return;
        this.deleteOperator(row);
        if (this.children) {
            for ( const children of this.children ) {
                    children.deleteCascader(row);
            }
        };
        delete this.table[deletedItem];
    };

    deleteCascader(upStreamRow) {
        if (this.onDelete.action == "setDefault") {
            for (const [key, row] of Object.entries) {
                if ( row[this.onDelete.key] == upStreamRow[this.onDelete.reference]) {
                    row[this.onDelete.key] = this.onDelete.default
                }
            }
        }
        else {
            for (const [key,row] of Object.entries) { if (key.startsWith(upStreamRow)) this.deleteRow(key) }
        }
    }
}

const filehelper =  ( folder, filename, fileInput, fileEmitFunction ) => {
    const reader = new FileReader();
    reader.onload = (e)=> {
        const base64String = e.target.result; 
        fetch('/api/upload', {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                src: folder ,
                image: base64String,
                filename: filename
            })     
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error(`Upload Failed with Response Code ${response.status}`)
            }
        }
        ).then(data => {
            const character = folder + "/" + data.fileName;
            fileEmitFunction(character);
        }).catch(error => {
                console.error('Upload Error' , error)
        })
    }
    const [file] = fileInput.files
    reader.readAsDataURL(file);
}
export { 
    LinkedList,
    graphNode,
    socket,
    isUpdatingFromServerState,
    addBoxTemplate,
    maps,
    characters,
    makeIndex,
    filehelper
    };
