class Player {
    constructor($context) {
        this.$context = $context;
        this.audio = this.getAudio();
        this.bindEvent();
        this.$context.find('.play').on('click', () => {
            this.isPlaying()
                ? this.pause()
                : this.play();
        });
        this.$context.find('.bar').on('click', (event) => {
            let ruler_wight = this.calculatePlayerRulerWight(event);
            this.audio.currentTime = (ruler_wight * this.audio.duration) / 100;
        });
    }
    bindEvent() {
        this.audio.onplay = () => {
            this.addActive();
        };
        this.audio.onpause = () => {
            this.removeActive();
        };
        this.audio.ontimeupdate = () => {
            this.ruler = this.calculateAudioRulerWight();
        };
    }
    calculatePlayerRulerWight(event) {
        return ((event.pageX - this.$context.find('.slider').offset().left) * 100) / this.wightSlider;
    }
    calculateAudioRulerWight() {
        return (this.audio.currentTime * 100) / this.audio.duration;
    }
    get wightSlider() {
        return this.$context.find('.slider').width();
    }
    set ruler(ruler) {
        this.$context.find('.ruler').width(ruler + '%');
    }
    isPlaying() {
        return this.$context.hasClass('active');
    }
    pause() {
        this.audio.pause();
        this.removeActive();
    }
    play() {
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
