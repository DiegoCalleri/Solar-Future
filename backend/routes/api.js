const apiRouter = require('express').Router();

const authRouter = require('./auth')
const digitalPins = require('./digital_pins')
const userRouter = require('./users')
const sensorRouter = require('./analog_sensors')
const ordersRouter = require('./orders')
const teamMembersRouter = require('./team_members')

apiRouter.use('/api', authRouter);
apiRouter.use('/api', digitalPins);
apiRouter.use('/api', userRouter);
apiRouter.use('/api', sensorRouter);
apiRouter.use('/api', ordersRouter);
apiRouter.use('/api', teamMembersRouter);

module.exports = apiRouter;