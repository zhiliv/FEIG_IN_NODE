'use strict'

var Q = require('q'), //библиотека для работы с promise
  TFEDM = require('./TypeFEDM'); //типы FEDM

/* ВЫВОД СООБЩЕНИЯ ЕСЛИ БИБИЛОТЕКА ПОДКЛЮЧЕНА УСПЕШНО */
exports.TestDLL = () => {
  TFEDM.TestDLL(null, (err, res) => {
    console.log(res);
  });
}

/* получение Ping считывателя */
exports.Ping = async ipReader => {
  var result = Q.defer();
  TFEDM.Ping(ipReader, (err, res) => {
    result.resolve(res)
  })
  return result.promise;
}

/* получение данных о метках */
exports.GetData = async params => {
  var result = Q.defer();
  TFEDM.GetData(params, (err, res) => {
    result.resolve(res);
  })
  return result.promise;
}