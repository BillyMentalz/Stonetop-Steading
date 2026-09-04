import {stringToHTML} from '../inject.js'

const listsRow = (index, text) => { // I decided that at this point that using Id kinda blows. So if you want to access element, the proper way would be to select element, index to access. If this is too much for you it's not trust me.
    const elementString = `
        <li data-index=${index}>
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
