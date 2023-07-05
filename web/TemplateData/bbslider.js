/**
 * Created by james.west on 3/30/2016.
*/
var BBSlider;

BBSlider = (function() {
    function BBSlider() {
        this.initialize.apply(this, arguments);
    }

    BBSlider.prototype.initialize = function(slider) {
        this.ul = slider.children[0];
        this.li = this.ul.children;
        this.ul.style.width = this.li[0].clientWidth * this.li.length + 'px';
        this.currentIndex = 0;
    };

    BBSlider.prototype.goTo = function(index) {
        index = index % this.li.length;
        this.ul.style.left = '-' + 100 * index + '%';
        this.currentIndex = index;
    };

    BBSlider.prototype.goToPrev = function() {
        this.goTo(this.currentIndex - 1);
    };

    BBSlider.prototype.goToNext = function() {
        this.goTo(this.currentIndex + 1);
    };

    return BBSlider;

})();