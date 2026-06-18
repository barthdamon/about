// window.onresize = function(){
// 	var h = $(window).height();
//    $("#profileImage").width(h);
// };
console.log("1337");

var min_w = 300; // minimum video width allowed
var vid_w_orig;  // original video dimensions
var vid_h_orig;

jQuery(function() { // runs after DOM has loaded

    if (!jQuery('#video-viewport').length) {
        return;
    }

    vid_w_orig = parseInt(jQuery('video').attr('width'));
    vid_h_orig = parseInt(jQuery('video').attr('height'));

    if (!vid_w_orig || !vid_h_orig) {
        return;
    }

    $('#debug').append("<p>DOM loaded</p>");

    jQuery(window).resize(function () { resizeToCover(); });
    jQuery(window).trigger('resize');
});

function resizeToCover() {

    // set the video viewport to the window size
    jQuery('#video-viewport').width(jQuery(window).width());
    jQuery('#video-viewport').height(jQuery(window).height());

    // use largest scale factor of horizontal/vertical
    var scale_h = jQuery(window).width() / vid_w_orig;
    var scale_v = jQuery(window).height() / vid_h_orig;
    var scale = scale_h > scale_v ? scale_h : scale_v;

    // don't allow scaled width < minimum video width
    if (scale * vid_w_orig < min_w) {scale = min_w / vid_w_orig;};

    // now scale the video
    jQuery('video').width(scale * vid_w_orig);
    jQuery('video').height(scale * vid_h_orig);
    // and center it by scrolling the video viewport
    jQuery('#video-viewport').scrollLeft((jQuery('video').width() - jQuery(window).width()) / 2);
    jQuery('#video-viewport').scrollTop((jQuery('video').height() - jQuery(window).height()) / 2);
};

jQuery(function() {
    document.querySelectorAll('.videoAutoplayWrap').forEach(function(wrap) {
        var video = wrap.querySelector('video');
        var button = wrap.querySelector('.videoPlayButton');

        if (!video || !button) {
            return;
        }

        function hideButton() {
            button.hidden = true;
        }

        function showButton() {
            if (video.paused) {
                button.hidden = false;
            }
        }

        function tryPlay() {
            video.muted = true;
            video.setAttribute('muted', '');

            var playAttempt;

            try {
                playAttempt = video.play();
            } catch (error) {
                showButton();
                return;
            }

            if (playAttempt && typeof playAttempt.then === 'function') {
                playAttempt.then(hideButton).catch(showButton);
            }
        }

        video.addEventListener('playing', hideButton);
        video.addEventListener('play', hideButton);
        video.addEventListener('pause', function() {
            if (!video.ended) {
                showButton();
            }
        });

        button.addEventListener('click', function() {
            hideButton();
            tryPlay();
        });

        tryPlay();

        setTimeout(function() {
            if (video.paused || video.readyState < 2) {
                showButton();
            }
        }, 1200);
    });
});
