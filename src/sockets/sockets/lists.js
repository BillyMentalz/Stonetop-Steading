

const listFormat = {
    'add': (element)=> {
        const last = element.lastElementChild;
        const num = last ? parseInt(last.dataset.index) + 1: 1 ; // You need to reevaluate what the fuck this guy was doing a week ago. 
        return {
            table:'lists',
            name: element.id,
            order: parseInt(num),
            text: 'Etc....'
        }
    },
    'update': (element, newValue) => {
        return {
            table: 'lists',
            name: name,
            order: order, 
            text: newInput.value
        }
    },
    'delete': (element) => { // PSUEDOCODE!!!! Please fix !!!
        return {
            table: 'lists',
            name: element.name ,
            order: element.order
        }
    }
}


export default {
    listFormat
}


