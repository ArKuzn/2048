
   /*const  GRID_ROWS = $('.grid-row').length;
    const GRID_CELLS = $('.grid-row > .grid-cell').length/gridRows;*/

$(document).ready(function() {
    Blocks[Blocks.length] = new Block();
    Blocks[Blocks.length] = new Block();
})

    $('html').keydown(function(e) {
    if (e.keyCode == 37) {
        if (Controller('left') == 0) {
            Blocks[Blocks.length] = new Block();
        }
    }
    if (e.keyCode == 38) {
        if (Controller('up') == 0) {
            Blocks[Blocks.length] = new Block();
        }
    }
    if (e.keyCode == 39) {
        if (Controller('right') == 0) {
            Blocks[Blocks.length] = new Block();
        }
    }
    if (e.keyCode == 40) {
        if (Controller('down') == 0) {
            Blocks[Blocks.length] = new Block();
        }
    }
});


let Blocks = [];
let id = 0;
let score = 0;
class Block {
    constructor(x = randPosition(), y = randPosition(), count=2, i = id) {
        this.x = x;
        this.y = y;
        this.count = count;
        this.i = i;
        this.BlockCheck();
        id++;
    }
    BlockCheck() {//проверяем блок на столкновение и отрисовываем 
        while (true) {
            let game_over = 0;
            for (let i = 0; i < Blocks.length; i++) {
                if ((Blocks[i].x == this.x) && (Blocks[i].y == this.y)) {
                        if (this.x == 4) {
                            if (this.y == 4) {
                                this.x = 1;
                                this.y = 1;
                                i = -1;
                                game_over += 1;
                                if (game_over > 1) {
                                  alert('Game Over');
                                    break;
                                }
                            } else {
                                this.y += 1;
                                this.x = 1;
                                i = -1;
                            }
                        } else {
                            this.x++;
                            i = -1;
                        }
                    
                }
            }
            if (game_over <= 1) {
                $(".tile-container").append(`<div class="tile tile-${this.count} tile-position-${this.x}-${this.y} tile-new"><div class="tile-inner">${this.count}</div></div>`);
            }
            break;
        }
    }
}
function Controller(key){

    let table = [[], [], [], []];//создаем массивы под каждую строчку/столбец
        let argumentPosition;
        argumentPosition = ((key == 'left')||(key =='right'))? `Blocks[i].y`: `Blocks[i].x`;
        for (let i = 0; Blocks.length > i; i++) {//обходим массив блоков и заполняем строки/столбцы
        switch (eval(argumentPosition)) {
        case 1:
            table[0].push(Blocks[i]);
            break;
        case 2:
            table[1].push(Blocks[i]);
            break;
        case 3:
            table[2].push(Blocks[i]);
            break;
        case 4:
            table[3].push(Blocks[i]);
            break;
        default:
            alert('Error')
        }
    }

        for(let i = 0;i<table.length;i++){//сортируем каждую строчку/столбец
            table[i] = BlockSort(table[i]);
        }
        return Move(table,key);


    //быстрая сортировка блоков по строке/столбцу
    function BlockSort(items) {
       if (items.length == 0) return [];
        var a = [], b = [], p = items[0];
        for (var i = 1; i < items.length; i++){ 
            let newItem,currentItem;
            switch(key){ //для горизонтального передвижения сравниваем по позиции х , для вертикального по y
                case 'left':
                    newItem = p.x;
                    currentItem = items[i].x;
                    break;
                case 'right'://противоположной клавише нужен противоложный массив поэтому меняем переменные
                     newItem = items[i].x;
                    currentItem = p.x;
                    break;
                case 'down':
                     newItem = items[i].y;
                    currentItem = p.y;
                    break;
                case 'up':
                    newItem = p.y;
                    currentItem = items[i].y;
                    break;
                default:
                alert('error: wrong key');
            }
        if (newItem > currentItem) a[a.length] = items[i];
       else b[b.length] = items[i];
     }
    return BlockSort(a).concat( p,BlockSort(b) );
    }
}

function Move(table,key){
        let stop = 1;
        for (let j = 0; j < 4; j++) {
            if (table[j].length > 0) {
                let loop = table[j].length;
                for (let i = 0; loop > i; i++) {
                    if (table[j][i]) {
                        if (table[j][i - 1]) {
                            if ((table[j][i].count == table[j][i - 1].count) && (table[j][i - 1].i != 'merged')) {//проверяем блоки на соединение
                               
                                let currentCount = table[j][i].count;
                                score +=currentCount*2;
                                $(".scores").text(`${score}`);
                                $(`.tile-position-${table[j][i].x}-${table[j][i].y}`).remove();//удаляем стили для двух блоков
                                $(`.tile-position-${table[j][i - 1].x}-${table[j][i - 1].y}`).remove();
                               
                                Blocks.splice(table[j][i].i, 1);//удаляем два блока из массива блоков
                               updateId();
                                Blocks.splice(table[j][i - 1].i, 1);
                                id -= 2;
                                table[j].splice(i, 1);//удаляем один блок из локального массива блоков(массив строчки или столбца)
                                table[j][i - 1].i = 'merged';//оставшийся помечаем что он уже совмещен, чтобы с ним не могли соединиться другие
                                table[j][i - 1].count *= 2;
                                Blocks[Blocks.length] = (key =='left') ? new Block(i,j + 1,currentCount * 2,id)://создаем новый блок на нужной нам позиции(Зависит от кнопки)
                                (key =='right') ? new Block(5 - i,j + 1,currentCount * 2,id):
                                   (key =='up') ? new Block(j + 1,i,currentCount * 2,id):
                                (key =='down') ? new Block(j + 1,5 - i,currentCount * 2,id):
                                alert('error: wrong key');
                                updateId();
                                id = Blocks.length;
                                i--;
                                stop = 0;
                                continue;
                            } 
                        } 
                            if (drawMove(j, i) == 0)
                                stop = 0;
                              continue;
                    }
                }
            }
        }
        return stop;
        function drawMove(j, i) {
            let length = 4;
            let x,y;//координаты которые нужны для выставления стиля позиции блока
            switch(key){
                case 'left':
                     y = 1 + j;
                     x = i + 1;
                    break;
                case 'right':
                     y = 1 + j;
                     x = Math.abs(i - length);
                    break;
                case 'down':
                     y = Math.abs(i - length);
                     x = j + 1;
                    break;
                case 'up':
                     y = 1 + i;
                     x = j + 1;
                    break;
                case defult:
                    alert('error: wrong key');
            }
            let tmp = 1;
            let currentTitle = $(`.tile-position-${table[j][i].x}-${table[j][i].y}`);
            if ((table[j][i].x != x) || (table[j][i].y != y)) {//сравниваем текущую позицию и будущую  если не совпадают то создаем дополнительный рандомный блок
                tmp = 0;
            } 
            $(".tile-new").removeClass(`tile-position-${table[j][i].x}-${table[j][i].y}`);
            currentTitle.toggleClass(`tile-position-${x}-${y}`);
            (key =='left') ?  Blocks[table[j][i].i].x = x://для горизонтальных меняем х в массиве блоков
             (key =='right') ? Blocks[table[j][i].i].x = x:
             (key =='up') ? Blocks[table[j][i].i].y = y://для вертикальных y
              (key =='down') ?  Blocks[table[j][i].i].y = y:
               alert('error: wrong key');
            return tmp;
        }
}
function randPosition(){
  return Math.floor(Math.random() *(4-1+1) )+1;
}
function updateId(){
   for (let i = 0; i < Blocks.length; i++) {
       Blocks[i].i = i;                          
    }
}