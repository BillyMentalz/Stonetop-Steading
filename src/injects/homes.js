import { stringToHTML } from 'root/inject.js'

const newHome = (row) => {
    return stringToHTML( `
    <div id=${row.homeName} class='S'> 
        ${row.homeName}
    </div>
    `);
};

const newSelectionHome = (row)=> {
    return stringToHTML(`
        <option value="${row.homeName}">${row.homeName} </option>
        `
    )
}

export {
    newHome,
    newSelectionHome
}
