var bgurl = "";
String.prototype.trunc =
     function( n, useWordBoundary ){
         if (this.length <= n) { return this; }
         var subString = this.substr(0, n-1);
         return (useWordBoundary
            ? subString.substr(0, subString.lastIndexOf(' '))
            : subString) + "…";
      };
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}
function abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "k", "m", "b","t"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) var shortNum = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
}
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
document.getElementById('button').addEventListener('click', (e)=>{
	window.open(`https://instagram.com/${location.hash.substring(3) ? location.hash.substring(3) : ""}`,'_top');
});
document.getElementById('photo').addEventListener('click', (e)=>{
	if(e.target == document.getElementById('photo')){
    window.open(bgurl,'_top');
  }
});
function load(){
	if((location.hash.startsWith('#!'))&&(location.hash.length > 3)){
		var hash = location.hash.substring(3).split('/');
    document.getElementById('ico').style.visibility = "hidden";
		if(hash[0] == "p"){
      fetch(`https://www.instagram.com/p/${hash[1]}/?__a=1`)
			.then(function(response) {
        if (response.status !== 200) {
          return ;
        }else{
          return response.json().then(function(data) {
            var caption = data.graphql.shortcode_media.edge_media_to_caption.edges[0] ? data.graphql.shortcode_media.edge_media_to_caption.edges[0].node.text.trunc(140,true) : "";
            document.title = `${data.graphql.shortcode_media.owner.full_name} on Instagram : "${caption}"`;
  			  	document.getElementById('name').innerText = data.graphql.shortcode_media.owner.full_name;
  			  	document.getElementById('btntext').innerText = `@${data.graphql.shortcode_media.owner.username}`;
            bgurl = data.graphql.shortcode_media.display_url;
  			  	document.getElementById('photo').style.setProperty('--url',`url(${bgurl})`);
  			  	document.getElementById('c1').innerText = abbreviateNumber(data.graphql.shortcode_media.edge_media_preview_like.count);
  			  	document.getElementById('c2').innerText = data.graphql.shortcode_media.is_video ? abbreviateNumber(data.graphql.shortcode_media.video_view_count) : "";
  			  	document.getElementById('c3').innerText = abbreviateNumber(data.graphql.shortcode_media.edge_media_to_parent_comment.count);
            document.getElementById('t1').innerText = "likes";
  			  	document.getElementById('t2').innerText = data.graphql.shortcode_media.is_video ? "views" : "";
  			  	document.getElementById('t3').innerText = "comments";
            document.getElementById('i2').style.display = data.graphql.shortcode_media.is_video ? "flex" : "none";
            bgurl = data.graphql.shortcode_media.is_video ? data.graphql.shortcode_media.video_url : bgurl;
            document.getElementById('bio').innerText = caption;
            document.getElementById('ico').style.visibility = data.graphql.shortcode_media.is_video ? "visible" : "hidden";
          });
        }
			  })
		}else if(hash.length < 3){
			fetch(`https://www.instagram.com/${hash[0]}/?__a=1`)
			.then(function(response) {
        if (response.status !== 200) {
          return ;
        }else{
          return response.json().then(function(data) {
            document.title = `${data.graphql.user.full_name} (@${data.graphql.user.username}) • Instagram photos and videos`;
  			  	document.getElementById('name').innerText = data.graphql.user.full_name;
  			  	document.getElementById('btntext').innerText = `@${data.graphql.user.username}`;
            bgurl = data.graphql.user.profile_pic_url_hd;
  			  	document.getElementById('photo').style.setProperty('--url',`url(${bgurl})`);
  			  	document.getElementById('c1').innerText = abbreviateNumber(data.graphql.user.edge_owner_to_timeline_media.count);
  			  	document.getElementById('c2').innerText = abbreviateNumber(data.graphql.user.edge_followed_by.count);
  			  	document.getElementById('c3').innerText = abbreviateNumber(data.graphql.user.edge_follow.count);
            document.getElementById('t1').innerText = "posts";
  			  	document.getElementById('t2').innerText = "followers";
  			  	document.getElementById('t3').innerText = "following";
            document.getElementById('i2').style.display = "flex";
            document.getElementById('bio').innerText = data.graphql.user.biography.trunc(140,true);
  			  });
        }
			  })
		}
	}else{
    document.getElementById('photo').style.setProperty('--url','none');
    bgurl = location.href;
    document.getElementById('c1').innerText =
    document.getElementById('c2').innerText =
    document.getElementById('c3').innerText =
    document.getElementById('t1').innerText =
    document.getElementById('t2').innerText =
    document.getElementById('t3').innerText =
    document.getElementById('name').innerText =
    document.getElementById('btntext').innerText = "";
    document.getElementById('bio').innerText = "Replace https://instagram.com/ with https://ali.js.org/insta-p/#!/";
  }
}

load();
window.onhashchange = ()=>{load();};
