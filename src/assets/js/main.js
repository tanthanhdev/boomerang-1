var currentEle = 1;
var size = $('.review-slides .slides').width();
var slidesLength = $('.review-slides .slides li').length;
var currentClientEl = 1;
var clientSize = $('.client-slides .slides').width() / 4;
var clientSlidesLength = $('.client-slides .slides li').length;
var counter_timer = $('.counter-timer');
var timeSpeed = 350;
var timeSpeedPortfolio = 400;

// Define function
var controlNavToggle = () => {
  $('.nav-toggle .menu-item-span').click((e) => {
    e.preventDefault();
    $('.nav-toggle .menu-item-span').unbind('click');
    $('.inner-navigation.collapse').slideToggle(timeSpeed);
    $('.inner-navigation.collapse').toggleClass('show');
    setTimeout(controlNavToggle, timeSpeed);
  });
};
// Nav scroll, Top button scroll 
$(window).scroll(() => {
  if($(window).scrollTop() > 1) {
    $('.header').addClass('header-small');
    $('.scroll-top').addClass('scroll-top-visible');
  } else {
    $('.header').removeClass('header-small');
    $('.scroll-top').removeClass('scroll-top-visible');
  }
});
// Review slides
var addTrans = (next, direction) => {
  let ulc = $('.review-slides .slides ul');
  let newL = 0;
  if (next != currentEle) {
    if(direction == 1) {
      if(currentEle < next) {
        for(let i=currentEle+1; i<=next; i++) {
          $('.review-slides .slides ul li[alt='+i+']').show().appendTo(ulc);
        }
        newL = ((currentEle-next)*size)+"px";
      } else {
        $('.review-slides .slides ul li[alt='+next+']').show().appendTo(ulc);
        newL = (-1*size)+"px";
      }
    } else {
      if(currentEle > next) {
        for(let i=currentEle-1; i>=next; i--) {
          $('.review-slides .slides ul li[alt='+i+']').show().prependTo(ulc);
        }
        ulc.css('left', ((next-currentEle) *size)+"px");
      } else {
        $('.review-slides .slides ul li[alt='+next+']').show().prependTo(ulc);
        ulc.css('left', ((-1*size)+"px"));
      }
    }
    
    $('.review-slides .active').removeClass('active');
    $('.review-slides .slides-dots .dot:nth-child(' + next + ')').addClass('active');
    ulc.animate({left: newL}, timeSpeed, () => {
      $('.review-slides .slides ul li[alt!='+next+']').hide();
      ulc.css('left',0);
      currentEle = next;
    });
  }
};
var addPagination = () => {   
  let stringHTML = '<div class="dot active"><span></span></div>';
  for (let i = 1; i < slidesLength; ++i) {
    stringHTML += '<div class="dot"><span></span></div>';
  }
  $('.review-slides .slides-dots').html(stringHTML);
};
var controlPrev = () => {
  $('.review-slides .slides-control-prev').click(() => {
    $('.review-slides .slides-control-prev').unbind('click');
    let prev = (currentEle > 1) ? currentEle-1 : slidesLength; 
    addTrans(prev, -1);
    setTimeout(controlPrev, timeSpeed);
  });
};
var controlNext = () => {
  $('.review-slides .slides-control-next').click(() => {
    $('.review-slides .slides-control-next').unbind('click');
    let next = (currentEle < slidesLength) ? currentEle + 1 : 1; 
    addTrans(next, 1);
    setTimeout(controlNext, timeSpeed);
  });
};
var reviewClickPagination = () => {
  $('.review-slides .slides-dots .dot').click(function() {
    $('.review-slides .slides-dots .dot').unbind('click');
    let clickElement = $(this).index() + 1;
    let direction = (currentEle > clickElement) ? -1 : 1;
    addTrans(clickElement, direction);
    setTimeout(reviewClickPagination, timeSpeed);
  });
};
$(window).resize(() => {
  $('.review-slides .slides li').css('width', $('.review-slides .slides').width())
});
// Counters
$.fn.countTo = function(options) {
  return this.each(function() {
    //-- Arrange
    const FRAME_RATE = 60; // Predefine default frame rate to be 60fps
    let $el = $(this);
    let countFrom = parseInt($el.attr('data-from'));
    let countTo = parseInt($el.attr('data-to'));
    let countSpeed = $el.attr('data-speed'); // Number increment per second

    //-- Action
    let rafId;
    let increment;
    let currentCount = countFrom;
    let countAction = () => {              // Self looping local function via requestAnimationFrame
      if(currentCount < countTo) {              // Perform number incremeant
        $el.text(Math.floor(currentCount));     // Update HTML display
        increment = countSpeed / FRAME_RATE;    // Calculate increment step
        currentCount += increment;              // Increment counter
        rafId = requestAnimationFrame(countAction);
      } else {                                  // Terminate animation once it reaches the target count number
        $el.text(countTo);                      // Set to the final value before everything stops
        //cancelAnimationFrame(rafId);
      }
    };
    rafId = requestAnimationFrame(countAction); // Initiates the looping function
  });
};
// Portfolio filters
var portfolioFilter = (data_filter) => {
  if (data_filter === '*' || data_filter === 'all') {
    $('.portfolio .portfolio-item').each(function() {
       $(this).animate({index: 0}, {
        duration: timeSpeedPortfolio,
        step: (val) => {
          $(this).show();
          $(this).removeClass('hide');
        },
        complete: () => {},
      });
    });
  } else {
    $('.portfolio .portfolio-item').each(function() {
      if($(this).find('span.subtitle').text().toLowerCase() != data_filter) {
        $(this).animate({index: 0}, {
          duration: timeSpeedPortfolio,
          step: (val) => {
            $(this).addClass('hide');
          },
          complete: () => {
            $(this).hide();
          },
        });
      } else {
        $(this).animate({index: 0}, {
          duration: timeSpeedPortfolio,
          step: (val) => {
            $(this).show();
            $(this).removeClass('hide');
          },
          complete: () => {},
        });
      } 
    });
  }
};

// Jquery main
$(() => {
  $('.inner-navigation').on('mouseenter mouseleave', '.desktop-nav .menu-item', function() {
    $(this).toggleClass('sub-menu-open');
  });
  $('.inner-navigation').on('click', '.mobile-nav .menu-item > a', function() {
    $(this).parent().toggleClass('sub-menu-open');
    $(this).children().toggleClass('rotate');
  });
  //Responsive slide image
  $(window).resize(() => {   
    $('.team .item').css('height', $('.team .item').width());  
  });
  // Mobile responsive 
  let navBreakpoint = 991; //max width responsive
  $(window).resize(() => {
    let widthWindow = Math.max($(window).width(), window.innerWidth);
    // Nav hover/click dropdown 
    let menuItem = $('.menu-item');
    // Remove old margins from sub-menus
    menuItem.children('.sub-menu, .mega-menu').css('margin-left', '');

    if (widthWindow >= navBreakpoint) {
      menuItem.children('.sub-menu, .mega-menu').each(function() {
        let offset = $(this).offset(); //get offset of top and left
        let totalWidth = $(this).width() + offset.left; //width of element and offset left
        let remainWidth = widthWindow - (totalWidth + 30); //get remaining width at position right

        if ( (totalWidth + 30) > widthWindow ) {
          $(this).css('margin-left', remainWidth);
        } else {
          $(this).css('margin-left', '');
        }
      });
    } else {
      $('.inner-navigation').css('display', '')
    }
    // Mobile/Desktop nav dropdown 
    if (widthWindow >= navBreakpoint) {
      $('.inner-nav').removeClass('mobile-nav');
      $('.menu-item').removeClass('sub-menu-open');
      $('.inner-nav').addClass('desktop-nav');
    } else {
      $('.inner-nav').removeClass('desktop-nav');
      $('.menu-item').removeClass('sub-menu-open');
      $('.inner-nav').addClass('mobile-nav');
    }
  }).resize();
  // Collapse navbar on click 
  controlNavToggle();
  // Nav scroll, Top button scroll 
  let count = 0;
  $(window).scroll(() => {
    if($(window).scrollTop() > 1) {
      $('.header').addClass('header-small');
      $('.scroll-top').addClass('scroll-top-visible');
    } else {
      $('.header').removeClass('header-small');
      $('.scroll-top').removeClass('scroll-top-visible');
    }
    // Counters
    if($(window).scrollTop() >= $('.posts').offset().top) {
      count++;
      if(count === 1) {
        counter_timer.each(function() {
          $(this).countTo();
        });
      }
    }
  });
  // Review slides
  addPagination();
  setInterval(() => {
    let next = (currentEle < slidesLength) ? currentEle + 1 : 1; 
    addTrans(next, 1);
  }, 5000);
  controlPrev();
  controlNext();
  reviewClickPagination();
  $('.review-slides .slides ul li[alt!='+currentEle+']').hide();
  $(window).resize(() => {   $('.review-slides .slides li').css('width', $('.slides').width())    });
  // Client slides
  $('.owl-carousel').owlCarousel({
    loop:true,
    nav:false,
    responsive:{
        0:{
            items:2
        },
        768:{
            items:4
        }
    }
  });
  // Portfolio
  $('.portfolio').on('click', '.filters li a', function(e) {
    e.preventDefault();
    let data_filter = $(this).attr('data-filter');
    $('.portfolio .current').removeClass('current');
    $(this).addClass('current');
    portfolioFilter(data_filter);
  });
});