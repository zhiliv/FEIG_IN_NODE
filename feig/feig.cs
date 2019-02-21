using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;
using System.Threading.Tasks;
using System.Threading;
using FEDM.Core;
using System.Collections;

namespace feig
{
  public class ConnectLib
  {
    public async Task<object> Invoke(object input)
    {
      return "Бибилотека подключена";
    }
  }
}

namespace FEDM
{
  public class Ping //проверка пинга
  {
    class Result
    {
      public string Status; //статус пинга
      public long Ping; //значение в мс
    }

    public async Task<object> Invoke(string input)
    {
      System.Net.NetworkInformation.Ping ping = new System.Net.NetworkInformation.Ping(); //создние объекта ping 
      var pingReply = ping.Send(input); //отправка пинга
      Result response = new Result(); //создане объекта для созранения результатта
      response.Status = Convert.ToString(pingReply.Status); //добавление в объект статуста
      response.Ping = pingReply.RoundtripTime; //добавление в объект значение милесикунд 
      return response; //возврат ответа
    }
  }

  public class GetData
  {
    class Row //класс для хранения строки
    {
      public string ip; //ip считывателя
      public string SRN; //метка
      public string Time; //время считывани
      public string Date; //дата считывания
    }

    public async Task<object> Invoke(dynamic input)
    {
      ArrayList result = new ArrayList(); //создание массива для хранеия результата
      ReaderModule Readers = new ReaderModule();//создаем объект - считватель
      Readers.IPort.ConnectTCP((string)input.ip, Convert.ToUInt32((uint)input.port));//соединение со считывателем
      Readers.IBrmTable.SetSize(1024);//устанавливаем размер таблицы
      Readers.IPort.SetPortPara("Timeout", "3000");
      int status;//переменная для хранения статуса ответа считывателя
      int ReqSets = 255;//количество блоков буфера00
      for (int t = 0; t <= Readers.IBrmTable.GetLength(); t++)
      {
        Readers.ICmd.SetCommandPara(FEDM.Core.ReaderCommand._0x22.Req.DATA_SETS, ReqSets);//указываем что считватель будет работать в режиме чтения буфера
        status = Readers.ICmd.SendProtocol(0x22);//отправялем команду перехоча в режим чтения буфера
        if ((status == 0x00) || (status == 0x83) || (status == 0x84) || (status == 0x85) || (status == 0x93) || (status == 0x94))//проверяем ответа статуса
        {
          IBrmTableGroup.BrmTableItem[] brmItems = new IBrmTableGroup.BrmTableItem[Readers.IBrmTable.GetLength()];//определяем  BRM таблицу

          int j;//переменная для перебора содержимого буфера
          if (Readers.IBrmTable.GetLength() > 0)//проверяем дколичество блоков
          {
            for (uint Sets = 0; Sets < Readers.IBrmTable.GetLength(); Sets++)//выполняем цикл для добавления таблицы буфера в массив
            {
              brmItems[Sets] = Readers.IBrmTable.GetItemByIndex(Sets);//заисиваем значение блок в массив
            }

            if (brmItems != null)//проверяем на пустоту таблицу
            {
              for (j = 0; j < brmItems.Length; j++)//перебираем таблицу массива для получения строк
              {
                if (brmItems[j].sectorTime.isValid)//проверяем строку на пустоту
                {
                  string serialnumber;//переменння для хранения серийного номера
                  string DateReaders;//переменная для хранения даты
                  string TimeReaders;//переменная для хранения времени
                  DateReaders = brmItems[j].sectorTime.GetDate(); //получение даты
                  Row rows = new Row(); //создание обхекта
                  rows.ip = input.ip; //доабвление ip считывателя
                  rows.SRN = brmItems[j].sectorIDD.GetIDD(); //добавление метки
                  rows.Time = brmItems[j].sectorTime.GetTime(); //добавление времени
                  rows.Date = brmItems[j].sectorTime.GetDate(); // добавление даты
                  result.Add(rows); //добавление обхекта в массив
                }
              }
              Readers.ICmd.SendProtocol(0x32);//очистква текущего блока буфера
            }
          }
        }
      }
      Readers.IPort.DisConnect();
      Readers.Dispose();
      return result; //возврат результата
    }
  }
}
