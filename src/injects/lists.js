import {stringToHTML} from '../inject.js'

const listsRow = (index, text) => { 
    const elementString = `
        <li data-dblclick="Edit" data-index=${index}>
            ${text}
        </li>`
    return stringToHTML(elementString);
}

const fullList = (id, rows) => {
    const elementString = `
        <ul > 
            ${rows.map(row => `
            <li>
                ${row.text} 
            </li>
            `).join('')} 
        </ul>` 
    return stringToHTML(elementString);
}

const defaultList = ()=> {
    return `
        <ul class="w">
            <li> Add here.... </li>
        </ul>
    `
}

const rowEnter  = (row) => {
    const elementString = `
        <li data-index="${row.listOrder}">
            <textarea>${row.listText}</textarea>
        </li>
    `
    return stringToHTML(elementString);
}

export {
    listsRow,
    defaultList,
    fullList,
    rowEnter,
}
