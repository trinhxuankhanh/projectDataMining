let fs = require('fs');
let readlineSync = require('readline-sync');
let Table = require('cli-table');
let trainingDataSet = []
let quit = false


function onHello() {
    console.log('1. Training dataset.')
    console.log('2. Test a sample.')
    console.log('3. Save and exit.')
    return readlineSync.question('> ')
}

function loadData() {
    trainingDataSet = JSON.parse(fs.readFileSync('./dataWare.json'));
    let table = new Table( { head: ['Id', 'A', 'B', 'C', 'Label'] } )
    for (const obj of trainingDataSet) table.push([obj.id, obj.A, obj.B, obj.C, obj.label])
    console.log(table.toString());
}

function main() {
    while( !quit ) {
        let selected = onHello()
        switch(selected) {
            case '1' : loadData(); break;
            case '2' :
            case '3' :
            default : console.log('You input wrong, try again.');
        }
    }
}


main()
