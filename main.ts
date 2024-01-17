
if (Deno.args.length != 1) {
  console.error("Usage: deno run --allow-read main.ts <filename>");
  Deno.exit(-1);
}

const langs = getFile(Deno.args[0]);
console.log(randomizeArray(langs));

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