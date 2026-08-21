import {stringToHTML} from '../inject.js'

const listsRow = (id, index, text) => { // I decided that at this point that using Id kinda blows. So if you want to access element, the proper way would be to select element, index to access. If this is too much for you it's not trust me.
    const elementString = `
        <li>
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

const rowEnter  = (element) => {
    const elementString = `
        <li data-index="${element.dataset.index}">  
            <textarea value=${element.textContent}>
            </textarea>
        </li>
    `
}

export {
    listsRow,
    defaultList,
    fullList,
    rowEnter,
}
