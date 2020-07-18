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

function countData(a, b, c) {
    trainingDataSet = JSON.parse(fs.readFileSync('./dataWare.json'));
    let pA = trainingDataSet.filter(sample => sample.A === a)
    let pB = trainingDataSet.filter(sample => sample.B === b)
    let pC = trainingDataSet.filter(sample => sample.C === c)
    let pPlus = trainingDataSet.filter(sample => sample.label === '+')
    let pMinus = trainingDataSet.filter(sample => sample.label === '-')
    let pAFilterPlus = pPlus.filter( sample => sample.A === a)
    let pAFilterMinus = pMinus.filter( sample => sample.A === a)
    let pBFilterPlus = pPlus.filter( sample => sample.B === b)
    let pBFilterMinus = pMinus.filter( sample => sample.B === b)
    let pCFilterPlus = pPlus.filter( sample => sample.C === c)
    let pCFilterMinus = pMinus.filter( sample => sample.C === c)
    let pPlusFilterA = testSample(pA.length, pPlus.length, pAFilterPlus.length)
    let pPlusFilterB = testSample(pB.length, pPlus.length, pBFilterPlus.length)
    let pPlusFilterC = testSample(pC.length, pPlus.length, pCFilterPlus.length)
    let pMinusFilterA = testSample(pA.length, pMinus.length, pAFilterMinus.length)
    let pMinusFilterB = testSample(pB.length, pMinus.length, pBFilterMinus.length)
    let pMinusFilterC = testSample(pC.length, pMinus.length, pCFilterMinus.length)
    let totalPlus = totalCharacter(pPlusFilterA, pPlusFilterB, pPlusFilterC)
    let totalMinus = totalCharacter(pMinusFilterA, pMinusFilterB, pMinusFilterC)
    if (( totalPlus - totalMinus ) > 0) {
        console.log(`This is result with Plus = ${totalPlus} and Minus = ${totalMinus}. Of class +`)
        saveData(trainingDataSet, a, b, c, '+')
    } else {
        console.log(`This is result with Plus = ${totalPlus} and Minus = ${totalMinus}. Of class +`)
        saveData(trainingDataSet, a, b, c, '-')
    }   
    if ( totalPlus = totalMinus ) console.log('..........!!!')
}

function testSample(p, pCharacter, pCharacterFilter) {
    return (pCharacterFilter * pCharacter) / p
}

function totalCharacter(pFilterA, pFilterB, pFilterC) {
    return pFilterA * pFilterB * pFilterC
}

function saveData(trainingDataSet, a, b, c, label) {
    let question = readlineSync.question('Do you want save sample into the training dataset(y/n)? > ')
    question.toUpperCase() === 'Y' ? trainingDataSet.push( { 
        id : trainingDataSet.length > 0 ? trainingDataSet[trainingDataSet.length - 1].id + 1 : 1,
        A : a,
        B : b,
        C : c,
        label : label
     } ) : trainingDataSet
    fs.writeFileSync('./dataWare.json', JSON.stringify(trainingDataSet))
}

function inputSample() {
    console.log('Input sample like format below:')
    let a = parseInt(readlineSync.question('A: '))
    let b = parseInt(readlineSync.question('B: '))
    let c = parseInt(readlineSync.question('C: '))
    countData(a, b, c)
}

function quit() {
    console.log('Bye.........')
    quit = true
}

function main() {
    while( !quit ) {
        let selected = onHello()
        switch(selected) {
            case '1' : loadData(); break;
            case '2' : inputSample(); break;
            case '3' : quit(); break;
            default : console.log('You input wrong, try again.');
        }
    }
}

main()
