const exec = require('child_process').exec;

module.exports = (cmd) => {
  return new Promise((res, rej) => {
    exec(cmd, function(error, stdout, stderr) {
      if (error) rej(error);
      else res(stdout);
    });
  });
};
