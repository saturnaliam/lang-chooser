import { delay } from 'https://deno.land/x/delay@v0.2.0/mod.ts';

if (Deno.args.length != 1) {
  console.error("Usage: deno run --allow-read main.ts <filename>");
  Deno.exit(-1);
}

let langs = getFile(Deno.args[0]);
langs = randomizeArray(langs);

// clearing the terminal
stdout("\x1b[H\x1b[2J");

await (spinner(langs))
console.log(`\x1b[37m\nYou're learning ${langs[Math.floor(langs.length / 2)]}!`);

// the actual spinner
async function spinner(array: any[]) {
  const spinTimes = randomInt(25, 40);
  let timeBetweenSpins = 100;

  for (let i = 0; i <= spinTimes; i++) {
    stdout(`\x1b[${array.length + 1}A`);
    array = cyclicalShiftRight(array);

    // printing out the elements w the current selected one highlighted
    array.forEach((element, index) => {
      let buffer = "";

      if (index === Math.floor(array.length / 2)) {
        buffer += "\x1b[39m> ";
      } else {
        buffer += "\x1b[38;5;240m";
      }

      buffer += element + "               ";
      console.log(buffer);
    });


    // decreases the wait time as the spintimes get reduced
    if (i >= spinTimes - 10) timeBetweenSpins += Math.floor(timeBetweenSpins / 5);
    await delay(timeBetweenSpins);
  }
}

// reads a file and splits it at every comma
function getFile(filename: string): string[] {
  try {
    const text = Deno.readTextFileSync(filename);
    const split = text.split(", ");

    return split;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`File "${filename}" not found!`);
    } else {
      console.error(error.message);
    }

    Deno.exit(-1);
  }
}

// randomizeds an array duh
function randomizeArray(array: any[]): any[] {
  const randomized: any[] = [];
  let indexes = range(0, array.length - 1);

  for (let i = 0; i < array.length; i++) {
    const index = indexes[randomInt(0, indexes.length - 1)];

    randomized.push(array[index]);
    indexes.splice(indexes.indexOf(index), 1);
  }

  return randomized;
}

// returns a random number integer from min - max
function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// returns a range from min - max
function range(min: number, max: number): number[] {
  const values: number[] = [];

  for (let i = min; i <= max; i++) {
    values.push(i);
  }

  return values;
}

// cyclical shifting from an array
function cyclicalShiftRight(array: any[]): any[] {
  const shiftedOut = array.pop();
  array.unshift(shiftedOut);
  return array;
}

// writes to stdout
function stdout(message: string) {
  Deno.stdout.writeSync(new TextEncoder().encode(message));
}