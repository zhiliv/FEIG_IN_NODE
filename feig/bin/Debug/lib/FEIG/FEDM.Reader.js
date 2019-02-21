'use strict'

var FEDM = require('./FEDM.Core'), //описане функций FEIG
  DB = require('./FuncDB'), //модуль для работы с БД
  Q = require('q'),//подключение бибилиотеки для работы с promise
  async = require('async');

/* обход полученных данных */
var ProcessingData = List => {
  var result = Q.defer();
  async.eachOfSeries(List, async (row, ind) => {
    DB.InsertHistory(row).then(() => { //добавление записи в БД
      if (ind == List.lenght - 1) {
        result.resolve(true);
      }
    })
  })
  return result.promise;
}

/* Запуск считвания */
exports.Start = async () => {
  var result = Q.defer();

  var AllLocomotiv;
  await DB.GetAllLocomotiv().then(res => {
    AllLocomotiv = res;
  })

  await async.eachOfSeries(AllLocomotiv, async (row, ind) => {
    var params = {};
    params.ip = row.ipAdrReader;
    params.port = row.PortReader;

    var ping;
    await FEDM.Ping(row.ipAdrReader).then(res => { //проверка пинга со считывателем
      ping = res;
    })

    /* проверка пинга  */
    if ((ping.Status == 'Success') && (ping.Ping < 10)) {
      await FEDM.GetData(params).then(res => {
        ProcessingData(res).then(() => {
          result.resolve(true);
        });
      })
    }
  })
  return result.promise;
}