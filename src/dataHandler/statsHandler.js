import { radio, select, number, checkbox} from 'root/inject/stat.js'
import { graphNode} from 'root/document.js'
const styleTable = {
    'radio':'radioBox,radioChoice',
    'select':'',
    'numbers':'',
    'number-asset':'numsInput', 
    'checkbox':'',
}

const views = {
    'radio':radio,
    'select':select,
    'number':number,
    'checkbox':checkbox
};

const statsCreateOperator = (row) => {
    let element = null;
    const parentElement  = document.getElementById(row.statName);
    const style =  styleHelper(parentElement);
    let selectedElement = null;
    switch (row.statType) {
        case 'radio': 
            element = radio(row.statName, style, row.statOptions.split(','));
            parentElement.append(element);
            selectedElement = parentElement.querySelector(`[value="${row.statValue}"]`)
            selectedElement.checked = true;
            break;
        case 'select-one': 
            element = select(row.statName, style, row.statOptions.split(','));
            parentElement.append(element);
            selectedElement = parentElement.querySelector(`select`);
            selectedElement.value = row.statValue;
            break;
        case 'number':
            element = number(row.statName, style );
            element.value = row.statValue;
            parentElement.append(element);
            break;
        case 'checkbox':
            element = checkbox(row.statName, style );
            element.checked = (row.statValue === 'true');
            parentElement.append(element);
            break;
    }
    return parentElement;
}

const styleHelper = (parent)=>{
    return styleTable[parent.dataset.entrypoint].split(',');
}

const statsUpdateOperator = (row)=>{
    const element = row.element;
    switch (row.statType){
        case 'radio':
            element.checked = true;
            break;
        case 'select-one':
            element.value = row.statValue;
            break;
        case 'number':
            element.value = row.statValue;
            break;
        case 'checkbox':
            element.checked = (row.statValue === 'true');
            break;
    }
    return element;
}

const statsDeleteOperator = (row) => {
    const selectedElement = row.element;
    selectedElement.remove();
}

const statNode = graphNode( 
    'stats',
    ['statName'],
    [],
    {},
    statsCreateOperator,
    statsUpdateOperator,
    statsDeleteOperator
)

export {
    statNode
}
