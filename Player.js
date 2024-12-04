class Player {
    constructor($context) {
        this.$context = $context;
        this.audio = $('body').find('audio')[0];
        this.$context.find('.play').on('click', () => {
            if (!this.playing) {
                // fixme нельзя напрямую менять dom других элементов Для этого у нас есть объекты, свойства, методы Переделай
                $('body').find('.b_player').removeClass('playing');
            }
            // fixme так писать нельзя Такое допустимо если нужно вызвать метод, а тут присвоение идет, менять на if else
            this.isCurrentTrack()
                ? this.updateAction()
                : this.audio.src = this.src;
            this.initEventsAudio();
        });
        this.$context.find('.bar').on('click', (event) => {
            let wight_px = event.pageX;
            this.audio.currentTime = (this.getWightRulerPctPlayerFromWightPx(wight_px) * this.audio.duration) / 100;
        });
    }
    isCurrentTrack() {
        let src_audio = decodeURI(this.audio.src).toLowerCase();
        let src_player = decodeURI(this.src).toLowerCase();
        return src_audio.includes(src_player);
    }
    updateAction() {
        this.playing
            ? this.pause()
            : this.play();
    }
    initEventsAudio() {
        this.audio.onplay = () => {
            this.playing = this.playing;
        };
        this.audio.onpause = () => {
            this.playing = this.playing;
        };
        this.audio.ontimeupdate = () => {
            this.wightRulerPct = this.getWightRulerPctAudio();
            this.currentTime = this.audio.currentTime;
        };
        this.audio.onloadedmetadata = () => {
            this.updateAction();
            this.duration = this.audio.duration;
        };
    }
    getWightRulerPctPlayerFromWightPx(wight_px) {
        let wight_ruler_px = (wight_px - this.$context.find('.slider').offset().left);
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
    set src(src) {
        this.$context.data('src', src);
    }
    get src() {
        return this.$context.data('src');
    }
    set currentTime(current_time) {
        this.$context.find('.current_time').text(this.convertSecToMin(current_time));
    }
    set duration(duration) {
        this.$context.find('.duration').text(this.convertSecToMin(duration));
    }
    // fixme метод может быть static
    convertSecToMin(sec = 0) {
        let min = Math.floor(Math.trunc(sec / 60));
        sec = Math.floor(sec % 60);
        return min + ':' + this.getSec(sec);
    }
    // fixme не надо выносить в функцию, используется один раз
    getSec(sec) {
        if (sec < 10)
            return '0' + sec;
        return sec;
    }
    set playing(playing) {
        playing
            ? this.$context.removeClass('playing')
            : this.$context.addClass('playing');
    }
    get playing() {
        return this.$context.hasClass('playing');
    }
    static create($context = $('.b_player')) {
        let $players = $context;
        let players = [];
        $players.each((index, element) => {
            let player = $(element);
            players.push(new Player(player));
        });
        return players;
    }
}
