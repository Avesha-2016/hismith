window.onload = function () {
    // получаем массив с объектами
    var elements = elemPoint('.section', '.menu__link');
    // массив объектов для анимации
    // done: была ли выполнена анимация
    // run: запустится функция при активной секции
    var leftElement = 16;
    if (window.innerWidth<=1020){
        leftElement = 10
    }
    var animations = [
        // 1 секция
        {
            'done': false,
            'run': function (node) {
                move(node, '.objects', 'right', 7);
            }
        },
        // 2 секция
        {
            'done': false,
            'run': function (node) {
                fade(node.querySelector('.section__title'), 0);
                setTimeout(function () {
                    move(node, '.section__text', 'left', leftElement, 2500)
                }, 700)
            }
        },
        // 3 секция
        {
            'done': false,
            'run': function (node) {
                setTimeout(function () {
                    chrenyMove('#' + node.id)
                }, 600);
                setTimeout(function () {
                    heave('#' + node.id)
                }, 600);
                fade(node.querySelector('.section__title'), 1);
                setTimeout(function () {
                    fade(node.querySelector('.section__text'), 0, 4000);
                }, 1400);
            }
        },
        // 4 секция
        {
            'done': false,
            'run': function (node) {
                setTimeout(function () {
                    chrenyBoom('#' + node.id)
                }, 300);
                setTimeout(function () {
                    percentMove('#' + node.id)
                }, 800);
            }
        },
        // 5 секция
        {
            'done': false,
            'run': function (node) {
                setTimeout(function () {
                    chrenyBoom('#' + node.id)
                }, 300);
                setTimeout(function () {
                    fade(node.querySelector('.section__link-wrapper'), 0);
                },1000)
            }
        }
    ]
    // вызываем функцию которая поставит активые классы и запустит анимацию
    activeElement(elements, animations);
    // запуск функций которая поставит активые классы и запустит анимацию при скролле
    window.onscroll = function () {
        activeElement(elements, animations);
    }
    // вешаем обработчик на скролл по клику на навгиции в меню и в подвале
    var linkNav = document.querySelectorAll('.menu__link, .footer__link');
    for (var i = 0; i < linkNav.length; ++i) {
        linkNav[i].onclick = function (event) {
            scrollToElemnt(event, elements);
        }
    }
}

// функция движения по right
// parent: родительский элемент
// elem: класс двигаемого элемента
// side: направление
// to: до какого значения
// t: продолжительность анимации
// f: количество кадров
function move(parent, elem, side, to, t, f){
    var elem = parent.querySelector(elem);
    var fps = f || 50;
    var time = t || 1000;
    var valueNew = to || 0;
    var steps = time / fps;
    var valueOld = (side=='left'?(getComputedStyle(elem).left.slice(0,-2)):(getComputedStyle(elem).right.slice(0,-2)))/parent.offsetWidth*100;
    var d0 = (valueNew-valueOld) / steps;
    var timer = setInterval(function(){
        valueOld += d0;
        side=='left'?(elem.style.left =  valueOld+'%'):(elem.style.right =  valueOld+'%');
        steps--;
        if(steps == 0){
            clearInterval(timer);
        }
    }, (500 / fps));
}

// функция изменения прозрачности
// elem: элемент
// o: единица или ноль - вниз или вверх идёт изменение
// t: продолжительность анимации
// f: количество кадров
function fade(elem, o, t, f){
    var fps = f || 50;
    var time = t || 2600;
    var steps = time / fps;
    var ops = o || 0;
    var to = o || 0;
    var d0 = 1 / steps;
    var timer = setInterval(function(){
        to?ops -= d0:ops += d0;
        if(!to&&!elem.style.display) {
            elem.style.display='block';
        }
        elem.style.opacity = ops;
        steps--;
        if(steps == 1&&to) {
            clearInterval(timer);
            elem.style.opacity = 0;
            elem.style.display = 'none';
        }
        if(steps == 0){
            clearInterval(timer);
        }
    }, (1000 / fps));
}

// функция скролла, прокручивает до секции с id
// указанным в href навигации
var scroll = new Scroll(document.body);
function scrollToElemnt(event, elements) {
    var href = event.target.getAttribute('href');
    elements.forEach(function (item) {
        if (item.node.id == href.slice(1)) {
            scroll.toElement(item.node, {duration: 1000});
        }
    })
}
// функция возвращает массив объектов
// top: расстояние до верха секции
// bottom: расстояние до низа секции
// node: ссылка на саму секцию
// nav: ссылка на навигацию для этой секции
function elemPoint(selector, navigation) {
    var x = document.querySelectorAll(selector);
    var y = document.querySelectorAll(navigation);
    var e = [];
    for (var i = 0; i < x.length; ++i) {
        e[i] = {
            'top': x[i].offsetTop,
            'bottom': x[i].offsetTop + x[i].offsetHeight,
            'node': x[i],
            'nav': y[i]
        };
    }
    return e;
}
// функция ставит активный класс на связанный
// с видимой секцией пункт навигации
// и запускает анимацию
function activeElement(elements, animations) {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    elements.forEach(function (item, i, arr) {
        if (scrolled >= item.top && scrolled < item.bottom) {
            arr.forEach(function (item, x) {
                if (x === i) {
                    item.nav.classList.add('menu__link--active');
                    if (animations[i].run && !animations[i].done) {
                        animations[i].run(item.node);
                        animations[i].done = true;
                    }
                } else {
                    if (item.nav.classList.contains('menu__link--active')) {
                        item.nav.classList.remove('menu__link--active');
                    }
                }

            })
        }
    });
}
// уменьшение гири
function heave(text) {
    var heave = Snap.select(text).select('.heave');
    heave.animate({transform: 's.5, .5, 130, 375'}, 2400);
}
// сдвиг процентов
function percentMove(text) {
    var percent = Snap.select(text);
    percent.select('.percent').animate({'transform': 't-122,0'}, 1200);
}
// хрень разлетается
function chrenyBoom(text) {
    var chreny = Snap.select(text);
    chreny.select('.circle_01').animate({'transform': 't-700,-550'}, 1200);
    chreny.select('.circle_02').animate({'transform': 't-200,-700'}, 1000);
    chreny.select('.circle_03').animate({'transform': 't800,-300'}, 1000);
    chreny.select('.path_01').animate({'transform': 't0,-500'}, 800);
    chreny.select('.path_02').animate({'transform': 't-900,0'}, 900);
    chreny.select('.path_03').animate({'transform': 't800,0'}, 800);
    chreny.select('.path_04').animate({'transform': 't-500,-500'}, 800);
}
// хрень двигается
var x = 1;
function chrenyMove(text) {
    var chreny = Snap.select(text);
    chreny.select('.circle_01').animate({'transform': 't-120,-50'}, 400);
    chreny.select('.circle_02').animate({'transform': 't-50,-70'}, 500);
    chreny.select('.circle_03').animate({'transform': 't60,-50'}, 600);
    chreny.select('.path_01').animate({'transform': 't0,-70'}, 500);
    chreny.select('.path_02').animate({'transform': 't-110,0'}, 480);
    chreny.select('.path_03').animate({'transform': 't40,0'}, 550);
    chreny.select('.path_04').animate({'transform': 't-60,-60'}, 440);
    chreny.select('.chreny').animate({'transform': 't0,70'}, 1350);
    setTimeout(function () {
        chrenyMoveReverse(text)
    }, 600);
}
function chrenyMoveReverse(text) {
    var chreny = Snap.select(text);
    chreny.select('.circle_01').animate({'transform': 't0,0'}, 400);
    chreny.select('.circle_02').animate({'transform': 't0,0'}, 500);
    chreny.select('.circle_03').animate({'transform': 't0,0'}, 600);
    chreny.select('.path_01').animate({'transform': 't0,0'}, 500);
    chreny.select('.path_02').animate({'transform': 't0,0'}, 480);
    chreny.select('.path_03').animate({'transform': 't0,0'}, 550);
    chreny.select('.path_04').animate({'transform': 't0,0'}, 440);
    if (x < 2) {
        setTimeout(function () {
            chrenyMove(text)
        }, 600);
        x++;
    }
}

// полифил для браузеров не понимающих classList
if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function () {
            var self = this;

            function update(fn) {
                return function (value) {
                    var classes = self.className.split(/\s+/),
                        index = classes.indexOf(value);

                    fn(classes, index, value);
                    self.className = classes.join(" ");
                }
            }

            var ret = {
                add: update(function (classes, index, value) {
                    ~index || classes.push(value);
                }),

                remove: update(function (classes, index) {
                    ~index && classes.splice(index, 1);
                }),

                toggle: update(function (classes, index, value) {
                    ~index ? classes.splice(index, 1) : classes.push(value);
                }),

                contains: function (value) {
                    return !!~self.className.split(/\s+/).indexOf(value);
                },

                item: function (i) {
                    return self.className.split(/\s+/)[i] || null;
                }
            };

            Object.defineProperty(ret, 'length', {
                get: function () {
                    return self.className.split(/\s+/).length;
                }
            });

            return ret;
        }
    });
}
