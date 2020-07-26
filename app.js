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

function inputSample() {
    console.log('Input sample like format below:')
    let a = parseInt(readlineSync.question('A: '))
    let b = parseInt(readlineSync.question('B: '))
    let c = parseInt(readlineSync.question('C: '))
    if ( [0, 1].includes(a, b, c) ) onHandleData(a, b, c); else console.log('You must input 1 or 0!')
}

function onHandleData(a, b, c) {
    trainingDataSet = JSON.parse(fs.readFileSync('./dataWare.json'));
    let pA = trainingDataSet.filter(sample => sample.A === a)
    let pB = trainingDataSet.filter(sample => sample.B === b)
    let pC = trainingDataSet.filter(sample => sample.C === c)
    let pPlus = trainingDataSet.filter(sample => sample.label === '+')
    let pMinus = trainingDataSet.filter(sample => sample.label === '-')
    let pAFilterPlus = pPlus.filter( sample => sample.A === a).length / pA.length
    let pAFilterMinus = pMinus.filter( sample => sample.A === a).length / pA.length
    let pBFilterPlus = pPlus.filter( sample => sample.B === b).length / pB.length
    let pBFilterMinus = pMinus.filter( sample => sample.B === b).length / pB.length
    let pCFilterPlus = pPlus.filter( sample => sample.C === c).length / pC.length
    let pCFilterMinus = pMinus.filter( sample => sample.C === c).length / pC.length
    let pPlusFilterA = testSample(pA.length / trainingDataSet.length, pPlus.length / trainingDataSet.length, pAFilterPlus)
    let pPlusFilterB = testSample(pB.length / trainingDataSet.length, pPlus.length / trainingDataSet.length, pBFilterPlus)
    let pPlusFilterC = testSample(pC.length / trainingDataSet.length, pPlus.length / trainingDataSet.length, pCFilterPlus)
    let pMinusFilterA = testSample(pA.length / trainingDataSet.length, pMinus.length / trainingDataSet.length, pAFilterMinus)
    let pMinusFilterB = testSample(pB.length / trainingDataSet.length, pMinus.length / trainingDataSet.length, pBFilterMinus)
    let pMinusFilterC = testSample(pC.length / trainingDataSet.length, pMinus.length / trainingDataSet.length, pCFilterMinus)
    let totalPlus = totalCharacter(pPlus.length / trainingDataSet.length, pPlusFilterA, pPlusFilterB, pPlusFilterC)
    let totalMinus = totalCharacter(pMinus.length / trainingDataSet.length, pMinusFilterA, pMinusFilterB, pMinusFilterC)
    if ((totalPlus - totalMinus) > 0) {
        console.log(`This is result with Plus = ${totalPlus} and Minus = ${totalMinus}. Of class +`)
        saveData(trainingDataSet, a, b, c, '+')
    } else {
        console.log(`This is result with Plus = ${totalPlus} and Minus = ${totalMinus}. Of class -`)
        saveData(trainingDataSet, a, b, c, '-')
    }   
    if ( totalPlus === totalMinus ) console.log('!!!!!')
}

function testSample(p, pCharacter, pCharacterFilter) {
    return (pCharacterFilter * p) / pCharacter
}

function totalCharacter(pCharacter, pFilterA, pFilterB, pFilterC) {
    return pCharacter * pFilterA * pFilterB * pFilterC
}

function quitProgramme() {
    console.log('Bye.........')
    quit = true
}

function saveData(trainingDataSet, a, b, c, label) {
    let question = readlineSync.keyInYN('Do you want save a sample into the training dataset? ')
    question === true ? trainingDataSet.push( { 
        id : trainingDataSet.length > 0 ? trainingDataSet[trainingDataSet.length - 1].id + 1 : 1,
        A : a,
        B : b,
        C : c,
        label : label
     } ) : trainingDataSet
    fs.writeFileSync('./dataWare.json', JSON.stringify(trainingDataSet))
}

function main() {
    do {
        let selected = onHello()
        switch(selected) {
            case '1' : loadData(); break;
            case '2' : inputSample(); break;
            case '3' : quitProgramme(); break;
            default : console.log('You input wrong, try again.');
        }
    } while( !quit )
}

main()