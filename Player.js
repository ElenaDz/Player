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
            let position_ruler_px = event.pageX;
            this.audio.currentTime = (this.getWightRulerPctPlayerFromWightPx(position_ruler_px) * this.audio.duration) / 100;
        });
    }
    bindEvent() {
        this.audio.onplay = () => {
            this.addPlaying();
        };
        this.audio.onpause = () => {
            this.removePlaying();
        };
        this.audio.ontimeupdate = () => {
            this.wightRulerPct = this.getWightRulerPctAudio();
        };
    }
    getWightRulerPctPlayerFromWightPx(position_ruler_px) {
        let wight_ruler_px = (position_ruler_px - this.$context.find('.slider').offset().left);
        return (wight_ruler_px * 100) / this.wightSliderPx;
    }
    getWightRulerPctAudio() {
        return (this.audio.currentTime * 100) / this.audio.duration;
    }
    get wightSliderPx() {
        return this.$context.find('.slider').width();
    }
    set wightRulerPct(wight) {
        this.$context.find('.ruler').width(wight + '%');
    }
    isPlaying() {
        return this.$context.hasClass('playing');
    }
    pause() {
        this.audio.pause();
    }
    play() {
        this.audio.play();
    }
    addPlaying() {
        this.$context.addClass('playing');
    }
    removePlaying() {
        this.$context.removeClass('playing');
    }
    getAudio() {
        return $('body').find('audio')[0];
    }
    static create($context = $('.player')) {
        return new Player($context);
    }
}
