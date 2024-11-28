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
            this.audio.currentTime = (this.calculateWightRulerPlayer(event) * this.audio.duration) / 100;
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
            this.wightRuler = this.calculateWightRulerAudio();
        };
    }
    calculateWightRulerPlayer(event) {
        return ((event.pageX - this.$context.find('.slider').offset().left) * 100) / this.wightSlider;
    }
    calculateWightRulerAudio() {
        return (this.audio.currentTime * 100) / this.audio.duration;
    }
    get wightSlider() {
        return this.$context.find('.slider').width();
    }
    set wightRuler(wight) {
        this.$context.find('.ruler').width(wight + '%');
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
