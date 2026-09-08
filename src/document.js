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
class graphNode {
    constructor(name , identifiers,  parent, cascadeRules, createOperator, updateOperator, deleteOperator, attachElement ) {
        this.table = {};
        this.name = name;
        this.identifiers = identifiers; 
        this.parent = parent;
        this.cascadeRules = cascadeRules;
        this.createOperator = createOperator;
        this.updateOperator = updateOperator;
        this.deleteOperator = deleteOperator;
        if (attachElement) {
            this.attachElement = document.getElementById(attachElement);
            this.attachElement.__graphNodeRef = this; 
        }
    }
    makeIndex (requirements, row) {
        const index = requirements.map(item=>row[item]).join('/%/');
        return index;
    }
    createRow(row) { // Remember to add wrappers on Deparsing and Time 
        const element = this.createOperator(row);
        const index = this.makeIndex( this.identifiers, row);
        element.__rowReference = row;
        row.element = element;
        this.table[index] = row;
        updateIndicate(element);
        if (Object.keys(this.cascadeRules).length !== 0) {
            const upIndex = (this.cascadeRules.down == undefined) ? row.characterHome :this.makeIndex(this.cascadeRules.down, row);
            const subscribeObject = {
                self: this,
                cascadeRules: this.cascadeRules,
                rows: [index ]
            }
            this.parent.addSubscriber(upIndex, this.name,  subscribeObject);
        }
    };

    addSubscriber(index, child, subscriberWrapper) {
        const row = this.table[index];
        if (!row) throw Error (`Index does not exist! Gen Index: ${index} child: ${child}`)
        if (row.subscribers === undefined) row.subscribers = {};
        if (Object.keys(row.subscribers).length !== 0 && row.subscribers[child]) {
            const oldrows = row.subscribers[child].rows
            const newrows = subscriberWrapper.rows
            row.subscribers[child].rows = [...oldrows, ...newrows]
            }
        else {
            row.subscribers[child] = subscriberWrapper
        }
    };
    
    updateRow(index ,updateValue) {
        //const index = this.makeIndex( this.identifiers, updateValue.prev);
        let newIndex = index;
        const row = this.table[index];
        if (!row) throw Error(`${row} does not exist!`);
        let updateKey = false;
        for (const [key,value] of Object.entries(updateValue.next))  {
            if (this.identifiers.includes(key)) {
                updateKey = true;
            }
            row[key] = value 
        }
        const element = this.updateOperator(row);
        element.__rowReference = row;
        row.element = element;
        updateIndicate(row.element);
        if (updateKey) {
                newIndex = this.makeIndex(this.identifiers, row);
                this.table[newIndex] = row;
                delete this.table[index];
        }
        if (row.subscribers) {
            for (const [child, group] of Object.entries(row.subscribers )) {
                const updates = {
                    prev: {},
                    next: {}
                } 
                for ( const [key,reference] of Object.entries(group.references)) {
                    if (updateValue.prev[reference]) {
                        updates.prev[key] = updateValue.prev[reference];
                        updates.next[key] = updateValue.next[reference];
                    }
                }
                if (updates) {
                    for (const [thing, subscriberIndex] of group.rows.entries()) {
                        let newSubscriberIndex = group.self.updateRow(subscriberIndex, updates);
                        if (newSubscriberIndex !== subscriberIndex) {
                            group.rows[thing] = newSubscriberIndex;
                        }
                    }
                }
            }
        }
        return newIndex;
    };
    deleteRow(deletedItem) {
        const row = this.table[deletedItem]
        if (!row) return;
        if (row.latestModified > deletedItem.deletedAt) return;
        this.deleteOperator(row);
        if (this.table[deletedItem].subscribers) {
            for ( const [child, group] of Object.entries(row.subscribers)) {
                if (!group.onDelete) {
                    for ( const [thing, subscriberIndex] of group.rows.entries()) {
                        group.self.deleteRow()
                    }
                }
                else {
                    for ( const [thing, subscriberIndex] of group.rows.entries()) {
                        group.onDelete(subscriberIndex , row)
                    }
                }
            }
        }
        delete this.table[deletedItem];
        
    };
    deleteCascade(id){
        if (Object.keys(this.cascadeRules.up).length === 0) {
            for ( const [key, value] of Object.entries(this.table)){
                if (key.startsWith(id)) {
                    this.deleteRow(key);
                };
            }
        }
        else {
            for (const [key, value] of this.table) {
                if (value.characterHome == id) {
                    value.characterHome = "At World's End"
                    this.updateOperator(value);
                }
            }
        }
        /*This last part is just me being lazy. Only motherfuckers has the ability to forego death if a location is dying */
    };
}
export { 
    LinkedList,
    graphNode,
    socket,
    isUpdatingFromServerState,
    addBoxTemplate,
    maps,
    characters
    };
