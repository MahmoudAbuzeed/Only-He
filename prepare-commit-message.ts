const fs = require('fs');
const path = require('path');
const hookFilePath = path.join('.git', 'hooks', 'prepare-commit-msg');
if (fs.existsSync(hookFilePath) && fs.statSync(hookFilePath).size > 0) {
  console.log('Hook file already exists and is not empty. Skipping creation.');
} else {
  fs.mkdirSync(path.dirname(hookFilePath), { recursive: true });
  fs.appendFileSync(hookFilePath, '#!/bin/sh\n BRANCH_NAME=$(git symbolic-ref --short HEAD)\n echo "[$BRANCH_NAME] $(cat $1)" > $1\n', { flag: 'a' });
  console.log('Hook file created and text appended successfully!');
}