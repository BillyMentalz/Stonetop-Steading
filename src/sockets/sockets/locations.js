

const characterFormat  = {
'add': (element) => {
        const last = element.lastElementChild;
        let sig = null;
        if (last) {
            sig = last.querySelector('.signifier').textContent;
            sig = String.fromCharCode(sig.charCodeAt(0) +1);
        }
        else {
            sig = 'A';
        }
        return {
            table: 'locations', 
            home: element.id ,
            signifier: sig, 
            name: '', 
            text: ''
        }
    }
}

