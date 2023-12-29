
//создаем модель таскборда
let data= localStorage.getItem('boards');

//если нет сохраненного то выдаем стартовый обьект
   if (data==null) {
    data = {
      "boards":[
         {
            "title": "Основная доска",
            "columns":[
               {
                  "title":"Мои задачи",
                  "cards":[

                  ]
               }
            ]
         }
      ]
   } 
}
else {
   data = JSON.parse(data);
}


//номер текущей  доски достаем из local storage
 let currentBoardId = localStorage.getItem('current_board');
 //если еще не сохраняли номер доски 
 if (currentBoardId==null){
   currentBoardId=0;
 }

//id чата в тлеграмме мой 
 let chat_id=1346484314;


//список фонов
let backgrounds=[
   'https://www.pixel-creation.com/wp-content/uploads/space-wallpapers-1920x1080-85-images.jpg',
   'https://catherineasquithgallery.com/uploads/posts/2021-02/1613641741_79-p-fon-dlya-prezentatsii-trava-108.jpg',
   'https://i.artfile.me/wallpaper/01-04-2019/3840x2160/3d-grafika-tekstury---textures-cvet-fon--1450941.jpg',
   'https://avatanplus.com/files/resources/original/57431d3297c44154de2a0dbe.jpg'
]



//запускаем рассыльщик
setInterval(function(){
   sender();
},5000);

//функция рассылки
function sender(){
   //бежим по всем доскам в модели 
   for (let i=0; i < data['boards'].length;i++) {
      //колонки
      for (let j=0; j < data['boards'][i]['columns'].length;j++) {
         //карточки
         for (let k=0; k < data['boards'][i]['columns'][j]['cards'].length; k++){
            //делаем рассыдку задачи если установленно время
            if (data['boards'][i]['columns'][j]['cards'][k]['time'] != ''){
               //отправка сообщения в телеграмм
               sendMessage(data['boards'][i]['columns'][j]['cards'][k]['title'],chat_id);

               //ставим отметку что уже отправлялось затирая время 
               data['boards'][i]['columns'][j]['cards'][k]['time']='';
            }
         }

      }
   }
   save();
   //если время совпало то делаем отправляем эту задачу в телеграм и помечаем что она отослана(убираем время )
}

//функция для отправки сообщения 
function sendMessage(text,chat_id) {
   //формируем адресс запроса
   let url="https://api.telegram.org/bot5886546930:AAFbwo3GQkztX6WhgqJjwbtl8GRy1GvTFP8/sendMessage?chat_id=" + chat_id + "&text=" + text;

   //отправляем запрос на этот адрес
   let xhr = new XMLHttpRequest();
   xhr.open('GET',url,true) //тут мы отправляем данные ассихроно и не ожидаем ответа
   xhr.send();
}

//функции создания колонки 
function columnAdd(){
   //создаем пустую колонку
   let column = {
      "title":"Мои задачи",
      "cards":[
      ]
   };
   //добавляем колонку на доску
   data['boards'][currentBoardId]['columns'].push(column)
   //вывести консоль 
   console.log(data);

   //перерисовываем доски 
   renderBoards();

   //сохраняем колонку
   save();

}


//функция переименования колонки 
function columnRename(number) {
   //Определяем содержимое
   let name= event.target.value;

   //перезаписываем имя колонки 
   data['boards'][currentBoardId]['columns'][number]['title'] = name;

   save();
}

renderBoards();
renderBackgrounds();


//функция сохранения

function save() {
   //кодируем data в JSON
   let dataJson =JSON.stringify(data);
   //сохраняем в LocalStorage
   localStorage.setItem('boards',dataJson);

   //сохряняем номер текущей доски 
   localStorage.setItem('current_board', currentBoardId);
}

//функция отрисовки досок 
function renderBoards(){
   //получаем шаблоны 
   let tmpl_board = document.getElementById('tmpl-board').innerHTML;
   let tmpl_column = document.getElementById('tmpl-column').innerHTML;
   let tmpl_card = document.getElementById('tmpl-card').innerHTML;
   
   
   //находим контейнер для доски 
   let container = document.getElementById('boards');

   //очищаем доски
   container.innerHTML = '';
   
   
   //в цикле подставляем данные в шаблоны 
   for(let i=0; i< data['boards'].length; i++){

      //если номер доски не совпадает с номером текущей доски то не рисуем 
      if (i != currentBoardId) {
         continue;  //пропуск хода
      }

      //собираем html колонок доски
      let boardColumns = '';
      for(let j=0; j< data['boards'][i]['columns'].length; j++) {

         //собираем html карточек колонки
         let columnCards = '';
         for(let k=0; k<data['boards'][i]['columns'][j]['cards'].length; k++) {
            //HTML одной карточки
            let =cardsHtml = tmpl_card.replace('${card_header}', data['boards'][i]['columns'][j]['cards'][k]['title'])
                                       .replace('${column_number}', j)
                                       .replace('${card_number}', k) 
                                       .replace('${card_notification}', data['boards'][i]['columns'][j]['cards'][k]['time'])
                                       .replace('${card_notification}', (data['boards'][i]['columns'][j]['cards'][k]['time'] !='') ? '&#10148;' : '' )
                                       .replace('${card_content}', data['boards'][i]['columns'][j]['cards'][k]['description']);

            //добавляем готовой текст карточки к какрточка колонки
            columnCards += cardsHtml;
         }

         

         //html одной колонки
         let =columnHtml = tmpl_column.replace('${column_header}', data['boards'][i]['columns'][j]['title'])
                                       .replace('${column_number}', j)
                                       .replace('${column_number}', j)
                                       .replace('${board_number}', i)
                                       .replace('${column_number}', j)
                                       .replace('${column_number}', j)
                                      
                                       .replace('${column_content}', columnCards);

         //добавляем готовой текст колонки к колонкам доски
         boardColumns += columnHtml;

      }

      //подставляем данные в шаблон доски и добавляем в контейнер 
      container.innerHTML += tmpl_board.replace('${board_header}',data['boards'][i]['title'])
                                       .replace('${board_background}',data['boards'][i]['background']) 
                                       .replace('${board_background}',data['boards'][i]['background']) 
                                       .replace('${board_number}',i) 
                                       .replace('${board_number}',i) 
                                       .replace('${board_content}', boardColumns);


   }

   renderBoardsList();
}

//функция для переключения фона
function changeBackground() {

   //получаем катинку из плитки
   let background = event.target.getAttribute('data-background');

   data['boards'][currentBoardId]['background'] = background;

   renderBoards();

   save();
}

// функция для переключения досок
function changeBoard() {

//определяем номер доски на которую кликнули
let num = event.target.getAttribute('data-num');
//меняем текущий номер доски 
currentBoardId = num;
//перерисовываем доски с учетом текущего номера
renderBoards();

//закрываем меню
toggleMenuTwo();

save();

}



//функция отрисовки плиток с фоном 
function renderBackgrounds(){
   //получаем шаблоны 
   let tmpl_background = document.getElementById('tmpl-background').innerHTML;

   //находим контейнер для доски
   let container = document.getElementById('sidebar');

   //в цикле подставляем данные в шаблон (собираем доски)
   for(let i=0; i< backgrounds.length; i++){
      container.innerHTML+= tmpl_background.replace('${background_image}', backgrounds[i])
                                             
                                             .replace('${background_image}',backgrounds[i]);
   }
}  


//функция отрисовки досок с фоном 
function renderBoardsList(){
   //получаем шаблоны 
   let tmpl_board = document.getElementById('tmpl-board-line').innerHTML;

   //находим контейнер для доски
   let container = document.getElementById('sidebar2Boards');

   //очищаем контейнер
   container.innerHTML='';

   //в цикле подставляем данные в шаблон (собираем доски)
   for(let i=0; i< data['boards'].length; i++){
      container.innerHTML+= tmpl_board.replace('${board_title}', data['boards'][i]['title'])
                                       .replace('${board_number}', i)
                                             .replace('${board_num}',i);
   }
}  






//функция переименования доски
function boardRename(number) {

   let name=event.target.value;

   data['boards'][number]['title'] = name;

   save();

   
}


//функция создания новой доски
function boardAdd(){
   //создаем обьект пустой доски
   let board ={
      "title": "Новая доска",
      "columns":[
         {
            "title":"Мои задачи",
            "cards":[

            ]
         }
      ]
   }


   //добавляем обьект в модель
   data['boards'].push(board);

   //переключаемся на новую доску

   currentBoardId = data['boards'].length - 1;
   //отрисовать доску

   renderBoards();
   // сохранить модель
   save();
}

//Функция для удаления колонок
function columnDelete(number) {
  
   //спросить потверждение
   let ok = confirm("Вы действительно хотите удалить колонку?");
   if(ok) {

   
   //определить номер колонки
      data['boards'][currentBoardId]['columns'].splice(number,1);
   //сохраняем 
      save();
   //перерисовываем 
      renderBoards();
   } 

}


function cardAdd(board_number, column_number) {
   //создаем пустую карточку
   let card = {};
   //получить содержимое поля
   let title = event.target.closest('.card-form').querySelector('.card-title').value;
   let description = event.target.closest('.card-form').querySelector('.card-description').value;
   let time = event.target.closest('.card-form').querySelector('.card-time').value;

   //наполняем карточку полученными данными 
   card['title'] = title;
   card['description'] = description;
   card['time'] = time;

   //добавить карточку модели 
   data['boards'][board_number]['columns'][column_number]['cards'].push(card)
   //вывести консоль 
   console.log(data);

   //перерисовываем карточки
   renderBoards();

   //сохраняем карточку
   save();
}

   
   
   //Функция удаления карточки 
   function cardDelete(column_number , card_number){
      //спросить потверждение
   let ok = confirm("Вы действительно хотите удалить карточку?");
   if(ok) {

   
   //определить номер колонки
      data['boards'][currentBoardId]['columns'][column_number]['cards'].splice(card_number,1);
   //сохраняем 
      save();
   //перерисовываем 
      renderBoards();
   } 
   }


   function boardDelete(number) {
    

      if(data["boards"].length == 1) {
          return alert ("Нельзя удалить одну доску!")
                  
              }

      let ok = confirm('Вы действительно хотите удалить доску?');
      
      //спросить хочет ли удалить колонку 
          if (ok) {
              
      
          //найти номер доски номер колонки и удалить 
          data["boards"].splice(number,1);

          if(data["boards"].length == 1 ||  data["boards"][number] == undefined) {
              currentBoard = 0;
                  
              }
      
          //сохранить 
          save();
      
          // отрисовать
          renderBoards();
      

         }
   }


   // показать/скрыть меню 1 

   function toggleMenu() {
     let menuOk= document.getElementById('sidebar')
     menuOk.classList.toggle('sidebar-active');
   }


    // показать/скрыть меню 2 

    function toggleMenuTwo() {
      let menuOk= document.getElementById('sidebar2')
      menuOk.classList.toggle('sidebar2-active');
    }



   //удаление и добавление подменю карточки 
   function cardNoneAdd() {

      event.target.closest('.card-form').querySelector('#box-input-cards').classList.toggle('none1');
      
      
   }


