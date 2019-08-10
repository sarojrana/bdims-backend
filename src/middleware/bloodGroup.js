const bloodGroup = require('express').Router();

bloodGroup.use((req, res, next) => {
  if(req.query.bloodGroup) {
    switch(req.query.bloodGroup) {
      case 'Ap':
        req.query.bloodGroup = 'A+';
        break;
      case 'An':
        req.query.bloodGroup = 'A-';
        break;
      case 'Bp':
        req.query.bloodGroup = 'B+';
        break;
      case 'Bn':
        req.query.bloodGroup = 'B-';
        break;
      case 'Op':
        req.query.bloodGroup = 'O+';
        break;
      case 'On':
        req.query.bloodGroup = 'O-';
        break;
      case 'ABp':
        req.query.bloodGroup = 'AB+';
        break;
      case 'ABn':
        req.query.bloodGroup = 'AB-';
        break;
      default: 
        req.query.bloodGroup = '';
        break;
    }
  }
  next()
})

module.exports = bloodGroup;