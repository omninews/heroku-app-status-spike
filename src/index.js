const Heroku = require('heroku-client');

const herokuToken = process.env.HEROKU_API_KEY
if (!herokuToken) {
  console.log("No HEROKU_API_KEY env var set");
  process.exit(1);
}

const heroku = new Heroku({token: herokuToken });
const appName = process.argv[2];
heroku.get(`/apps/${appName}/dynos`)
  .then(dynos => {
    const allUp = dynos.every(d => d.state === "up");
    if (!allUp) {
      const allEitherStartingOrUp = dynos.every(d => d.state === "up" || d.state === "starting");
      if (allEitherStartingOrUp) {
        console.log("Yellow");
        process.exit(0);
      } else {
        console.log("Red");
        process.exit(1);
      }
    } else {
      console.log("Green");
      process.exit(0);
    }
  })
  .catch(err => {
    console.log(err, err.stack);
    process.exit(1);
  });
