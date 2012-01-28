$(document).ready(function () {


	String.prototype.capitalize = function(){
		return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
	};

	function activateSection(loc) {
		var sections = ['home', 'about', 'posts'],
			regex = /[\d,\w,\s]*\.html/gi,
			file = loc.match(regex),
			file = (file) ? file[0].replace(".html", "") : "home",
			section = (file === 'index') ? "home" : "posts", // defaults to post as only one without consistent filename
			i,
			sectionsLen = sections.length;

		for (i = 0; i < sectionsLen; i = i + 1) {
			if (sections[i] === file) {
				section = sections[i]
			};
		}

		$(".nav li a:contains(" + section.capitalize() + ")").addClass("active");
	}

	activateSection(window.location.href);

	$("#post h2").each(function (index, elem) {

	    $(elem).addClass("title");

	});

	$(".header .back a").attr("href", document.referrer);

});