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
}


export { 
    LinkedList,
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
    characterInfo
    };
