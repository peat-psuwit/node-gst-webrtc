const fs = require('fs');

if (process.argv.length != 3) {
    console.log('Usage: node generateOnGetterSetter.js <file to update>');
    process.exit(1);
}

const fileName = process.argv[2];
const linesInput = fs.readFileSync(fileName, { encoding: 'utf-8' }).split('\n');
let linesOutput = [];
let eventTypePairs = [];

let i = 0;

while (i < linesInput.length) {
    const line = linesInput[i];
    linesOutput.push(line);
    i++;

    if (line == 'type TEvents = {')
        break;
}

if (i == linesInput.length) {
    console.error('Cannot find the start of TEvents definition.');
    process.exit(2);
}

while (i < linesInput.length) {
    const line = linesInput[i];
    linesOutput.push(line);
    i++;

    if (line == '};') {
        break;
    } else {
        const regexp = /^ *([a-zA-Z0-9]+): ([a-zA-Z0-9]+);$/;
        const matchResult = line.match(regexp);

        if (!matchResult) {
            console.error(`Cannot parse '${line}' to an event-type pair.`);
            process.exit(2);
        }

        console.log(`Found event '${matchResult[1]}' of type '${matchResult[2]}'`);
        eventTypePairs.push([matchResult[1], matchResult[2]]);
    }
}

if (i == linesInput.length) {
    console.error('Cannot find the end of TEvents definition.');
    process.exit(2);
}

let whitespace = '';
let tEventTarget = '';

while (i < linesInput.length) {
    const line = linesInput[i];
    linesOutput.push(line);
    i++;

    const regexp = /^( *)\/\/ BEGIN generated event getters & setters; TEventTarget = ([a-zA-Z0-9]+)$/;
    const matchResult = line.match(regexp);
    if (matchResult) {
        whitespace = matchResult[1];
        tEventTarget = matchResult[2];
        break;
    }
}

if (i == linesInput.length) {
    console.error('Cannot find the start of generated event getter setter.');
    process.exit(2);
}

for (const kv of eventTypePairs) {
    const [event, eventType] = kv;
    linesOutput.push(`\
${whitespace}get on${event}(): EventTargetShim.CallbackFunction<${tEventTarget}, ${eventType}> | null {
${whitespace}  return getEventAttributeValue<${tEventTarget}, ${eventType}>(this, '${event}');
${whitespace}}
${whitespace}set on${event}(value) {
${whitespace}  setEventAttributeValue(this, '${event}', value);
${whitespace}}
`);
}

while (i < linesInput.length) {
    const line = linesInput[i];
    i++;

    const regexp = /^( *)\/\/ END generated event getters & setters$/;
    const matchResult = line.match(regexp);
    if (matchResult) {
        linesOutput.push(line);
        break;
    }
}

if (i == linesInput.length) {
    console.error('Cannot find the end of generated event getter setter.');
    process.exit(2);
}

// This can fail if there're lots of remaining lines. However it starts to
// show up at ~100,000 entries, and in our case the whole file isn't that long
// anyway.
// https://stackoverflow.com/a/1374131
linesOutput.push(...linesInput.slice(i));

fs.writeFileSync(fileName, linesOutput.join('\n'));
