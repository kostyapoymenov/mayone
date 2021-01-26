$(document).ready(function(){
  $(".owl-carousel").owlCarousel({
    items: 1,
    loop: true,
    nav: true
  });

  burger(); // работа бунгера на мобильниках
  numberUp(); // увеличение чиселпри скролле
  popupShow(); // модальные окна с видео портфолио
  menuScroll(); // активный пункт главного меню при скроле
  jQuery(function(){
    jQuery(window).scroll(scroll_active);
  }); // активный пункт бургер меню при скроле
  modalForm();

  function numberUp(){
    var show = true;
    $(window).on("scroll load resize", function () {
      if (!show) return false;
      var h_scroll = $(window).scrollTop() + 200;
      var elem_top = $('.stat-section').offset().top;
      if(h_scroll >= elem_top){
        $('.stat-num').each(function () {
          $(this).prop('Counter',0).animate({
           Counter: $(this).data('num')
           }, {
            duration: 2000,
            easing: 'linear',
            step: function (now) {
               $(this).text(Math.ceil(now));
            }
          });
          show = false;
       });    
      }
    });
  }
  function burger(){
    const   burgerBtn = $('.burger'),
            burgerItem = $('.burger-nav__link'),
            burgerMenu = $('.burger-menu');

    burgerBtn.on('click', function(){
      burgerBtn.toggleClass('burger--active');
      burgerMenu.toggleClass('burger-menu--active');
      if(burgerBtn.hasClass('burger--active')){
        $('body').addClass('body-hidden');
      } else {
        $('body').removeClass('body-hidden');
      }
    });

    burgerMenu.on('click', function(event){
      var target = event.target;

      for(var i = 0; i < burgerItem.length; i++){
        if(target == burgerItem[i]){
          burgerBtn.removeClass('burger--active');
          burgerMenu.removeClass('burger-menu--active');
          $('body').removeClass('body-hidden');
          scroll(burgerItem[i]);
        }
      }
    });
  }
  function scroll(){
    var linkNav = document.querySelectorAll('[href^="#"]'),
        V = 0,
        d = 90; // высота header
    for (var i = 0; i < linkNav.length; i++) {
        linkNav[i].addEventListener('click', function(e) {
            e.preventDefault();
            var w = window.pageYOffset - d,
                hash = this.href.replace(/[^#]*(.*)/, '$1'),
                t = document.querySelector(hash).getBoundingClientRect().top,
                start = null;
            requestAnimationFrame(step);
            function step(time) {
                if (start === null) start = time;
                var progress = time - start,
                    r = (t < 0 ? Math.max(w - progress/V, w + t) : Math.min(w + progress/V, w + t));
                window.scrollTo(0,r);
                if (r != w + t) {
                    requestAnimationFrame(step)
                } else {
                    location.hash = hash
                }
            }
        }, false);
    }
  }
  function popupShow(){
    function Popap(){
      this.overlay = $('.overlay');
      this.popup = $('.popup');
      this.iframe = $('.popup__iframe');
      this.body = $('body');
      
      this.open = function(linkVideo){
        this.overlay.addClass('overlay--active');
        this.popup.addClass('popup--active');
        this.body.addClass('body-hidden');
        this.iframe.attr('src', linkVideo);
      }
  
      this.close = function(){
        this.overlay.removeClass('overlay--active');
        this.popup.removeClass('popup--active'); 
        this.body.removeClass('body-hidden'); 
        this.iframe.attr('src', '');
      }
    }

    var pop = new Popap();
    var link = $('.portfolio__item_link');
    var close = $('.close');
  
    link.on("click", function(){
      var linkVideo = $(this).attr("data-link-video");
      pop.open(linkVideo);
    });
    close.on("click", function(){
      pop.close();
    });
  }
  function menuScroll(){
    const menuItem = $('.nav__link');

    menuItem.on('click', function(event){
      var target = event.target;

      for(var i = 0; i < menuItem.length; i++){
        $(menuItem[i]).removeClass('nav__link--active')
        if(target == menuItem[i]){
          $(this).addClass('nav__link--active');
          scroll(menuItem[i]);
        }
      }
    });
  }
  function scroll_active() {
    const menuItem = $('.nav__link');
    const menuBurgerItem = $('.burger-nav__link');
    /* вычисляем значения прокрутки страницы по вертикали */
    var window_top = $(window).scrollTop();
    /* вычисляем положение якорей на странице от начала страницы  по вертикали*/
    var hero_top = $('#hero').offset().top - 50;
    var about_top = $('#about').offset().top - 200;
    var portfolio_top = $('#portfolio').offset().top - 200;
    var service_top = $('#service').offset().top - 200;
    var feedback_top = $('#feedback').offset().top - 200;
    var application_top = $('#application').offset().top - 360;

    if (window_top > application_top) {
      menuItem.removeClass("nav__link--active");
      menuBurgerItem.removeClass("nav__link--active");
      $('a[href="#application"]').addClass("nav__link--active");
    }
    else if (window_top > feedback_top) {
      menuItem.removeClass("nav__link--active");
      menuBurgerItem.removeClass("nav__link--active");
      $('a[href="#feedback"]').addClass("nav__link--active");
    }
    else if (window_top > service_top) {
      menuItem.removeClass("nav__link--active");
      menuBurgerItem.removeClass("nav__link--active");
      $('a[href="#service"]').addClass("nav__link--active");
    }
    else if (window_top > portfolio_top) {
      menuItem.removeClass("nav__link--active");
      menuBurgerItem.removeClass("nav__link--active");
      $('a[href="#portfolio"]').addClass("nav__link--active");
    }
    else if (window_top > about_top) {
      menuItem.removeClass("nav__link--active");
      menuBurgerItem.removeClass("nav__link--active");
      $('a[href="#about"]').addClass("nav__link--active");
    }
    else if (window_top > hero_top) {
      menuItem.removeClass("nav__link--active");
      menuBurgerItem.removeClass("nav__link--active");
      $('a[href="#hero"]').addClass("nav__link--active");
    }
  }
  function modalForm(){
    var btnOder =  $('.btn-order');
    var formModal = $('#formModal');

    btnOder.on('click', function(){
      $('body').addClass('body-hidden').append(formModal.html());
    });
    $(document).on('click', '.close-modal', function(){
      $('body').removeClass('body-hidden');
      // $('.overlay-modal').addClass('overlay-modal--none');
      $('.overlay-modal').remove();
      // formModal.find('.modal-form').appendTo($(this).parents('.modal-form').html());
      $(this).parents('.modal-form').remove();
      
    });
  }
  
  $('form').submit(function(e) {
    e.preventDefault();
    var formID = $(this).attr('id'); // Получение ID формы
    var formNm = $('#' + formID);
    $.ajax({
        type: 'POST',
        url: 'mail.php', // Обработчик формы отправки
        data: formNm.serialize(),
        success: function (data) {
             var res = JSON.parse(data);
                $(formNm).find('.form__block-name .error_name').removeClass('form__block-error');
                $(formNm).find('.form__block-phone .error_name').removeClass('form__block-error');
            for( value in res){
                if(value == 'name'){
                    $(formNm).find('.error_name').html(res[value]);
                    $(formNm).find('.form__block-name .error_name').addClass('form__block-error');
                    console.log(1);
                } else if(value == 'phone') {
                    $(formNm).find('.error_phone').html(res[value]);
                    $(formNm).find('.form__block-phone .error_phone').addClass('form__block-error');
                    console.log(2);
                } else if(value == 'sucess') {
                    $(formNm).html(res[value]);
                }
            }
        }
    });
    return false;
  });
});

  
