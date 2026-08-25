import { stringToHTML} from 'root/inject.js'
const markerElement = (row) => {
    return `
       <div> This is an example to be fixed later </div> 
    `;
}

const markerInfo = (row) => {
    return `
        <div> I've done nothing wrong </div>
    `
}

export {
    markerElement,
    markerInfo
}
