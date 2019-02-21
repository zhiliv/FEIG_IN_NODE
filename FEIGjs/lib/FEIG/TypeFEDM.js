'use strict'

var edge = require('edge-js');

/* проверка подключения к бибилиотеке */
var TestDLL = edge.func({
  assemblyFile: './lib/FEIG/dll/feig.dll',
  typeName: 'feig.ConnectLib'
});
module.exports.TestDLL = TestDLL; //экспорт переменной

var Ping = edge.func({
  assemblyFile: './lib/FEIG/dll/feig.dll',
  typeName: 'FEDM.Ping'
})
module.exports.Ping = Ping; //экспорт переменной

/* Получение данных */
var GetData = edge.func({
  assemblyFile: './lib/FEIG/dll/feig.dll',
  typeName: 'FEDM.GetData'
})
module.exports.GetData = GetData;