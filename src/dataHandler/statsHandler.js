const statsOperator = (key, value )=>{
    let element = null;
    switch (value.statType){
        case 'radio':
            element  = document.querySelector(`[name="${key}"][value="${value.statValue}"]`)
            element.checked = true;
            break;
        case 'select-one':
            element  = document.querySelector(`[name="${key}"]`)
            element.value = value.statValue;
            break;
        case 'number':
            element  = document.querySelector(`[name="${key}"]`)
            element.value = value.statValue;
            break;
        case 'checkbox':
            element = document.querySelector(`[name=${key}]`)
            element.checked = (value.statValue === 'true');
            break;
    }
    return element;
}

export {
    statsOperator
}
