

$(document).ready(function () {
  // TOGGLING NAVBAR ON SMALL SCREENS
  $('nav .navbar > p.navbar-toggle').on('click', function () {
    $('nav.navigation .navbar .nav-right').addClass('animate').toggle();
  });

  // RESPONSIVE NAV BAR FUNCTIONALITY
  $(window).on('resize', function () {
    if ($(this).width() > 700) {
      $('nav.navigation .navbar .nav-right').css('display', 'block');
    } else if( $('nav.navigation .navbar .nav-right').css('display') == 'block') {
                $('nav.navigation .navbar .nav-right').css('display', 'none');
            }
  });

});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js',)
  .then(reg => {
    console.log('Service worker successfully registered');
  })
}


