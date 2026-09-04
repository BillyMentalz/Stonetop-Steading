const stringToHTML = (str)=> {
    const parse = new DOMParser();
    const doc = parse.parseFromString(str,'text/html');
    return doc.body.firstChild;
};

const stringToHTMLTable = (str)=> {
    const thing = `<table>
        <tbody>${str} </tbody>
    </table>`
    const parse = new DOMParser();
    const doc = parse.parseFromString(thing, 'text/html');
    return doc.querySelector('tr');
}

const EntryPointsAndStyleTable = {
    'radio':'radioContainer,radioBox,radioChoice', // REMEMBER: AT THE END ADD A COMMA TO PREVENT BUFFER OVERFLOW
    'select':'selectContainer,',
    'number': '',
    'number-asset':'numsInput,',
    'checkbox': '',
}

const EntryPointTable = {
    'radio': '' ,
    'select': '',
    'number': '',
    'number-asset': '',
    'checkbox': '',
}

const loadInjections = () => {
    const entryPoints = document.querySelector('[data-entrypoint]')    
    entryPoints.foreach(entryPoint => {
        const thing = entryPoint.dataset.entrypointq
        EntryPointTable
        
    })
};

const updateEntryPoints = (element, entrypoint)=> {
   return; 
}


export {
    stringToHTML,
    stringToHTMLTable,
    loadInjections,
    updateEntryPoints
}
