const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./api/middlewares/errorHandler');
const authRoutes = require('./api/routes/auth');
const groupRoutes = require('./api/routes/groups');
const contributionRoutes = require('./api/routes/contributions');
const invoiceRoutes = require('./api/routes/invoices');
const loanRoutes = require('./api/routes/loans');
const loanRepayRoutes = require('./api/routes/loanRepay');
const dashboardRoutes = require('./api/routes/dashboard');
const integrationRoutes = require('./api/routes/integrations');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/groups', groupRoutes);
app.use('/groups', contributionRoutes);
app.use('/groups', invoiceRoutes);
app.use('/groups', loanRoutes);
app.use('/groups', dashboardRoutes);
app.use('/loans', loanRepayRoutes);
app.use('/', integrationRoutes);

app.use(errorHandler);

module.exports = app;
