class Player {
    constructor($context) {
        this.$context = $context;
        this.audio = this.getAudio();
        // fixme а ниже разве не bind Events идут в этом коде ? почему они не в этом методе Плохое имя функции
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
    // fixme в имени функции wight_px в передается position_ruler_px, ерунда передавать нужно wight_px
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
    pause() {
        this.audio.pause();
    }
    play() {
        this.audio.play();
    }
    // todo добавь публичные свойства currentTime и duration
    // fixme замени эти 3 функции свойством playing с getterом и setterом
    addPlaying() {
        this.$context.addClass('playing');
    }
    removePlaying() {
        this.$context.removeClass('playing');
    }
    isPlaying() {
        return this.$context.hasClass('playing');
    }
    // fixme вызывается один раз, не нужно выносить в отдельную фукнцию
    getAudio() {
        return $('body').find('audio')[0];
    }
    static create($context = $('.player')) {
        return new Player($context);
    }
}
