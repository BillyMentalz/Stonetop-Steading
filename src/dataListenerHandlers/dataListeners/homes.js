import {socket} from 'root/document.js'
const homeAdd = [
    'click',
    '.tabIcon',
    (parent, element, event) => {
        console.log('ojoijoij')
    }
    
    
]

const homeDelete = [
    'dblclick',
    'li',
    (parent, element, event) => {
        console.log("hoioiojoij")
    }

]

export {
    homeAdd,
    homeDelete
}
