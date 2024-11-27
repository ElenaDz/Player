class Player {
    constructor($context) {
        this.$context = $context;
        this.audio = this.getAudio();
        this.buildEvent();
        this.$context.find('.play').on('click', () => {
            this.getPlaying()
                ? this.setPause()
                : this.setPlay();
        });
        this.$context.find('.bar').on('click', (event) => {
            let played_excerpt = this.calculatePlayerPlayedExcerpt(event);
            this.audio.currentTime = (played_excerpt * this.audio.duration) / this.wightSlider;
        });
    }
    buildEvent() {
        this.audio.onplay = () => {
            this.addActive();
        };
        this.audio.onpause = () => {
            this.removeActive();
        };
        this.audio.ontimeupdate = () => {
            this.ruler = this.calculateAudioPlayedExcerpt();
        };
    }
    calculatePlayerPlayedExcerpt(event) {
        return ((event.pageX - this.$context.find('.slider').offset().left) * 100) / this.wightSlider;
    }
    calculateAudioPlayedExcerpt() {
        return (this.audio.currentTime * 100) / this.audio.duration;
    }
    get wightSlider() {
        return this.$context.find('.slider').width();
    }
    set ruler(ruler) {
        this.$context.find('.ruler').width(ruler + '%');
    }
    getPlaying() {
        return this.$context.hasClass('active');
    }
    setPause() {
        this.audio.pause();
        this.removeActive();
    }
    setPlay() {
        this.audio.play();
        this.addActive();
    }
    addActive() {
        this.$context.addClass('active');
    }
    removeActive() {
        this.$context.removeClass('active');
    }
    getAudio() {
        return $('body').find('audio')[0];
    }
    static create($context = $('.player')) {
        return new Player($context);
    }
}
