const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, () => {
  console.log(`iChama backend running on http://localhost:${PORT}`);
});
