  $(function(){
    hello.init({ // Authentication
      google  : '1048493793081-u2q1pt37p5ooptb37986b6hnaaag5us2.apps.googleusercontent.com'
    });
    var google = hello('google').getAuthResponse();
    if (google)
      var googleToken = google.access_token;
    // Login
    $('#login').click(function(){
      hello('google').login()
    });
    // Logged in
    if (googleToken) {
      $('#token').val(googleToken);
      $('.pre-auth').hide();
      $('.post-auth').show();
    } else { // Logged out
    }

    // Get username if logged in
    $.ajax({
      url: 'https://spreadsheets.google.com/feeds/list/1k81G2L3naGWvAI0M_PJCDaA1tOLOZ99sz4GbnYaYk6Q/od6/public/basic?hl=en_US&alt=json',
      success: function(data){
        var rows = data.feed.entry;
        var total = rows.length;

        for(var i = total-1;i > -1; i--) {
          var currentCell = rows[i].content.$t.split(',').toString().split(': ').toString().split(',');
          var currentToken = rows[i].title.$t;
          if (googleToken == currentToken) {
            $('#name').val(currentCell[1]);
            $('#name').hide();
            $('#setName').show();
            break;
          }
        }
      }
    });

    // Get item name
    var baseurl = 'https://jsonp.afeld.me/?callback=?&url=http://services.runescape.com/m=itemdb_oldschool';
    var dataid = window.location.hash.substr(1);
    $.getJSON(baseurl + '/api/catalogue/detail.json?item=' + dataid, function(data){
      var name = data.item.name;
      $('#item').val(name);
    });

// Load with sheetrock
// $('#statistics').sheetrock({
//   url: "https://docs.google.com/spreadsheets/d/1k81G2L3naGWvAI0M_PJCDaA1tOLOZ99sz4GbnYaYk6Q/edit#gid=0"
// });


  });

  // Change name
  $('#setName').click(function(){
    var name = $('#name');
    $('#name').toggle();
  });

  // Submit form without reloading page (using AJAX)
  $('#submit').click(function(){
    $('#form').submit();
    setTimeout(checkUpdates, 800);
    var uniq = Math.round(new Date().getTime() + (Math.random() * 100));
    $('#unique').val(uniq);
  });

  function checkUpdates(){
    $.ajax({
      url: 'https://spreadsheets.google.com/feeds/list/1k81G2L3naGWvAI0M_PJCDaA1tOLOZ99sz4GbnYaYk6Q/od6/public/basic?hl=en_US&alt=json',
      success: function(data){
        var rows = data.feed.entry;
        var total = rows.length;
        var last = rows[total-1];
        var id = last.title.$t;
        var content = last.content.$t.split(',').toString();
        var item = content.split('item: ').pop().toString().split(',')[0];
        var price = content.split('price: ').pop().toString().split(',')[0];
        // $('#tradingPost').prepend('<div id="yourstuff">PRICE:'+ price +'<br>ITEM:'+ item +'</div>');
        $('#price').val('');
      }
    });
  };

  // Change CSS
  if (!$('#buysell:checked').length) {
    $('#buy').css('color', 'rgba(0,0,0,1)');
    $('#sell').css('color', 'rgba(0,0,0,0.1)');
  } else {
    $('#sell').css('color', 'rgba(0,0,0,1)');
    $('#buy').css('color', 'rgba(0,0,0,0.1)');
  }
  $('#buysell').click(function(){
    if (!$('#buysell:checked').length) {
      $('#buy').css('color', 'rgba(0,0,0,1)');
      $('#sell').css('color', 'rgba(0,0,0,0.1)');
    } else {
      $('#sell').css('color', 'rgba(0,0,0,1)');
      $('#buy').css('color', 'rgba(0,0,0,0.1)');
    }
  });
