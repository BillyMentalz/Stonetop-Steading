import {}


const stringToHTML = (str)=> {
    const parse = new DOMParser();
    const doc = parse.parseFromString(str,'text/html');
    return doc.body.firstChild;
};



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
}

const updateEntryPoints = (element, entrypoint)=> {
    
}


export {
    loadInjections
    updateEntryPoints
}
