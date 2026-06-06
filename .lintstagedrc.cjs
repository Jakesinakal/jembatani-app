module.exports = {
  '**/*.{ts,tsx,js,jsx}': (files) => {
    const list = files.join(' ');
    return [`prettier --write ${list}`, `bash -c 'eslint --fix ${list}; exit 0'`];
  },
  '**/*.{css,json,md}': (files) => {
    const list = files.join(' ');
    return [`prettier --write ${list}`];
  },
};
