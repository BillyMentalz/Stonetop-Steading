

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




const loadInjections = () => {

}

const updateEntryPoints = (element, entrypoint)=> {
    
}


export {
    loadInjections
    updateEntryPoints
}
