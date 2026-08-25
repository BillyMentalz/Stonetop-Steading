import { stringToHTML} from 'root/inject.js'
const characterRow = (row) => {
    return `
       <div> This is an example to be fixed later </div> 
    `;
}

const characterSheet = (row) => {
    return `
        <div> I've done nothing wrong </div>
    `
}
const characterEnter = (row) => {
    return `
        <div> fixing when I get to it. </div>
    `
}

export {
    characterRow,
    characterSheet,
    characterEnter
}
