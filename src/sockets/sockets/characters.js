

const characterFormat = {
    'add': (element)=> { 
        return {
            table: 'characters',
            id: crypto.randomUUID(),
            home: `At World's End`,
            name: 'Add here...',
            pronouns: '(They/them)',
            occupation: 'New Occupation',
            info : 'New fellow...',
            traits: 'Friendly'
        }
    },
}
