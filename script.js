var world_width = 40;
var world_height = 40;
var hero_posX = 1;
var hero_posY = 1;

//var hero = new Hero();
$(window).load(function() {

    $("#buttons").dialog({
	dialogClass: "no-close"
    });
    
    var overworld = new Overworld();
    var hero = new Hero();


    overworld.init();

    $(document).keydown(function(key) {
	overworld.scrollMap(parseInt(key.which));	
    });

});

function Hero() {
    var $hero = $("#hero");

    /*
    $hero.position({my : "center center",
		    at : "center center",
		    of : "#overworld",
		    collision: "none"});
    */
    $hero.css({"opacity":0.7, "color":"red"});

}

function Overworld() {

    var $overworld = $("#overworld");  
    var $hero = $("#hero");

    var row = 3;   // 1 = initial hero position, 2 = numbers, 3 = start of map
    var col = 1;   // note: nth-child elements start indexing from 1

    var hero_row = 10;     // hero starts here - arbitrary,
    var hero_col = 23;     //  just ensure position is safe

    var line_height = 0;   // a slight fiddle to ensure hero is
    var col_width = 0;     // lined up correctly on the map

    // set up the overworld window
    $overworld.dialog({
	dialogClass: "no-close",
	cursor:"pointer",
	height:300,
	width:300,
	resizeStop: function(event, ui) { 
            updateVariables();
            recentreWindow();
            moveHero(hero_col, hero_row); 
        }

    });

    $overworld.css('cursor', 'default');
    $overworld.css("overflow", "hidden");  // scroll bars

    /* align hero to a column/row */
   function moveHero(tocol, torow) {
       var x,y;
       x = $("#overworld #map_cols :nth-child(" + tocol + ")").position().left;
       y = $("#overworld  div:nth-child(" + torow + ")").position().top;
       
       y += (row-3)*line_height;
       $hero.css({top:y, left:x});
    }

    function generateMap()  {
	var map = new Array(world_height);

	$overworld.append('<div id = "map_cols">');
	$("#map_cols").css({
 	    position: 'absolute',
	    visibility: "hidden",
	});

	// this helps with scrolling left and right
	// comment out visibility: hidden above to see
	var k=1;
	for (var i = 1; i < world_width+1; i++) {
	    if (k == 10) k = 0;
	    $("#map_cols").append("<span>" + k + "</span>");
	    k++;
	}
	$overworld.append("</div>");


	// and this is the ascii map
	for (var i = 3; i <= world_height; i++) {
	    map[i] = new Array(world_width);
	    for (var j = 1; j <= world_width; j++) {
		
		
		var tree = Math.floor((Math.random()*10)+1);
		if (tree > 7) {
		    map[i][j] = "T";
		}
		else {
		    map[i][j] = ".";
		}
		
                /*
		if (j % 2 === 0)
		    map[i][j] = i%10;
		else
		    map[i][j]='.';
                */
		    
	    }
	    $overworld.append("<div>" + map[i].join("") + "</div>");
	}
	$overworld.append("<div><br><\div>");

    }

    this.init = function() {
        
        generateMap();
        updateVariables();
        recentreWindow();

        // manually adjust hero's position so she's in line with
        // the row & column she starts at (i.e. almost centre, but
        // probably not exactly)
        
        moveHero(hero_col, hero_row);
        
    }


    function recentreWindow() {

        // reset scroll to top left
        $overworld.scrollTop(0);
        $overworld.scrollLeft(0);

        // scroll position of overworld window so hero will be in the centre
        
        var offset = $overworld.height()/line_height;
        row = Math.ceil(hero_row-offset/2);
        if (row < 3)
	    row = 3;
        var $val = $("#overworld  div:nth-child(" + row + ")");
        $overworld.scrollTop($val.position().top);

        var offset = $overworld.width()/col_width;
        col = Math.ceil(hero_col-offset/2);
        $val = $("#overworld #map_cols :nth-child(" + col+ ")");
        $overworld.scrollLeft($val.position().left);
        
    }


    // these are used to position hero char in centre of overworld
    var top_centre_line = 3;
    var bottom_centre_line = 40;
    var left_centre_line = 1;
    var right_centre_line = 40;

    function updateVariables() {
	line_height = 
	    $("#overworld  div:nth-child(4)").position().top - 
	    $("#overworld  div:nth-child(3)").position().top;

	col_width = 
	    $("#overworld #map_cols :nth-child(4)").position().left - 
	    $("#overworld #map_cols :nth-child(3)").position().left;
	
	var centre_pos =  
	    $("#overworld  div:nth-child(3)").position().top +
	    ($overworld.height() / 2);

        for (var i = 3; i <= world_height; i++) {
	    if ($("#overworld  div:nth-child(" + i + ")").position().top > centre_pos) {
		top_centre_line = i-1;
		break;
	    }
	}

	centre_pos =
	    $("#overworld  div:nth-child(" + world_height + ")").position().top +
	    line_height -
	    ($overworld.height() / 2);

	for (var i = world_height; i >= 3; i--)  {
	    if ($("#overworld  div:nth-child(" + i + ")").position().top < centre_pos) {
		bottom_centre_line = i+1;
		break;
	    }
	}

	centre_pos =
	    $("#overworld #map_cols :nth-child(1)").position().left +
	    ($overworld.width() / 2);

	for (var i = 1; i <= world_width; i++) {
	    if ($("#overworld #map_cols :nth-child(" + i + ")").position().left > centre_pos) {
		left_centre_line = i-1;
		break;
	    }
	}

	centre_pos = 
	    $("#overworld #map_cols :nth-child(" + world_width + ")").position().left +
	    col_width -
	    ($overworld.width() / 2);

	for (var i = world_width; i >= 1; i--) {
	    if ($("#overworld #map_cols :nth-child("+i+")").position().left < centre_pos) {
		right_centre_line = i+1;
		break;
	    }
	}
    }

    function heroCentredV() {
	return (hero_row >= top_centre_line && hero_row <= bottom_centre_line);
    }

    function heroCentredH() {
	return (hero_col >= left_centre_line && hero_col <= right_centre_line);
    }

    this.scrollMap = function(keycode) {
	//console.log("sm", row, col, hero_row, hero_col);
	switch(keycode) {
	case 40:  // move hero down
	    if (hero_row < world_width) {
		if (heroCentredV() && row < world_height) {
		    row++;
		    var l = $overworld.scrollLeft();   // deal with some firefox idiosyncrasy
		    $("#overworld  div:nth-child(" + row + ")")[0].scrollIntoView();
		    $overworld.scrollLeft(l);
		}
		hero_row++;
		$hero.animate({top:"+=" + line_height + "px"},0);
	    }
	    break;
	case 38:  // move hero up
	    //console.log("38", row, hero_row);
	    if (hero_row > 3) {          
		// scroll down so line hero has moved to is in the centre
		if (heroCentredV() && row > 3) {
		    row--;
		    var l = $overworld.scrollLeft(); // ffox issue
		    $("#overworld  div:nth-child(" + row + ")")[0].scrollIntoView();
		    $overworld.scrollLeft(l);
		}
		// move hero up a line
		hero_row--;
		$hero.animate({top:"-=" + line_height + "px"}, 0);
	    }
	    break;
	case 37:  // left
	    if (hero_col > 1) {
		if (heroCentredH() && col > 1) {
		    col--;
		    var $val = $("#overworld #map_cols :nth-child(" + col+ ")");
		    $overworld.scrollLeft($val.position().left);
		}
		hero_col--;
		$hero.animate({left:"-=" + col_width + "px"}, 0);
	   }
	    break;
	case 39:  // right
	    if (hero_col < world_width) {
		if (heroCentredH() && col < world_width) {
		    col++;
		    var $val = $("#overworld #map_cols :nth-child(" + col+ ")");
		    $overworld.scrollLeft($val.position().left);
		}
		hero_col++;
		$hero.animate({left:"+="+col_width+"px"},0);
	    }
	    break;

	default: return;
	}

    }

}

