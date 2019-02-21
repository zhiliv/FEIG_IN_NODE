'use strict'

var mysql = mysql = require('mysql'), //подключение библиотеки для работы с mysql
  Q = require('q'), //бибилиотека для работы с promise
  moment = require('moment'); //подключение momentjs

moment.locale('ru'); //указание локации у moment js

/* указываем параметры соединения с БД */
var DB = mysql.createConnection({
  host: '10.50.0.127', //адрес сервера БД
  user: 'map', //имя пользователя БД
  password: 'maps', //пароль пользователя БД
  database: 'TestPosition', //имя БД
});

/* получение всех считывателей */
exports.GetAllLocomotiv = () => {
  var result = Q.defer();
  var sql = 'SELECT * FROM Readers WHERE status="true"';
  DB.query(sql, (err, rows) => {
    result.resolve(rows);
  })
  return result.promise;
}

/* добавление записи в БД */
exports.InsertHistory = params => {
  var result = Q.defer();
  var sql = 'INSERT INTO HistoryReaders (ipAdrReaders, SRN, DateTimeReaders, DateTimeRecive) VALUES(?, ?, ?, ?)';
  var DateTimeReaders = moment(params.Date + ' ' + params.Time).format('YYYY-MM-DD HH:mm:ss');
  var DateTimeRecive = moment().format('YYYY-MM-DD HH:mm:ss');
  params = [params.ip, params.SRN, DateTimeReaders, DateTimeRecive];
  sql = DB.format(sql, params);
  DB.query(sql, (err, rows) => {
    result.resolve(true)
  })
  return result.promise;
}