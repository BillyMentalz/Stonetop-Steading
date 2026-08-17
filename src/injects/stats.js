import {stringToHTML } from 'root/inject.js';

const radio = (name,style, options)=> {
    const elementString = `
        ${options.map(option => `
            <div class="${style[0]}">
                <input type="radio" name="${name}" value="${option}">
                <p class="${style[1]}">${option}</p>
            </div>
        `).join('')}`;
    return stringToHTML(elementString);
}

const select = (name,style,options)=> {
    const elementString =`
        <select class='${style[0]}' name="${name}" >
            ${options.map(option => `<option value="${option}">${option}</option>`).join('')}
        </select>
    `
    return stringToHTML(elementString);
}

const number = (name,style)=> {
    const elementString = `<input type="number" class="${style[0]}" name="${name}">`
    return stringToHTML(elementString);
}

const checkbox = (name,style)=> {
    const elementString = `<input type="checkbox" class="${style[0]}" name="${name}" value="${name}">`
    return stringToHTML(elementString);
}

const defaultStat = (name,style)=> {
    const elementString = `<div>Something that I don't know about </div>`
}

export {
    radio,
    select,
    number,
    checkbox
}
