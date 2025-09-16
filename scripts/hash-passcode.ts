import readline from 'node:readline/promises';
import bcrypt from 'bcryptjs';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const pass = await rl.question('Enter an editor passcode to hash: ');
await rl.close();
const hash = await bcrypt.hash(pass, 10);
console.log('\nEDITOR_PASSCODE_BCRYPT=\n' + hash + '\n');
