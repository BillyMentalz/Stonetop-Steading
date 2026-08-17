import { stringToHTML } from 'root/inject.js'

const newHome = (row) => {
    return stringToHTML( `
    <div id=${row.homeName} class='S'> 
        ${row.homeName}
    </div>
    `);
};


