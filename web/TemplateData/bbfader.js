/**
 * Created by james.west on 4/15/2016.
 */
var htmlArray = [
     'Imagine Math Facts is enormously powerful so it takes a minute to load.',
     'Please close all other programs and tabs to free up memory.',
     'Imagine Math Facts should cache and load much faster the 2nd time.',
     'For now Firefox can reload 6x faster than other browsers.',
     'If the browser freezes, it is normally just parsing code.',
     'Imagine Math Facts should cache and load much faster the 2nd time.',
     'If Imagine Math Facts is running slowly try switching to windowed mode.'
];
var curIndex = 0;
var duration = 10000;

function slideShow() {
    document.getElementById('bb-slider').className += "fadeOut";
    setTimeout(function() {
        document.getElementById('bb-slider').innerHTML = htmlArray[curIndex];
        document.getElementById('bb-slider').className = "";
    },1000);
    curIndex++;
    if (curIndex == htmlArray.length) { curIndex = 0; }
    setTimeout(slideShow, duration);
}
