'use strict'

var FEDMReadr = require('./lib/FEIG/FEDM.Reader'),
  FEDM = require('./lib/FEIG/FEDM.Core'); //описание функций FEIG
FEDM.TestDLL(); //проверка подключения библиотеки

setInterval(async () => {
  FEDMReadr.Start();
}, 5000);