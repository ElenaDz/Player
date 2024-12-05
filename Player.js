class Player {
    constructor($context) {
        this.$context = $context;
        this.audio = $('body').find('audio')[0];
        this.$context.find('.play').on('click', () => {
            if (!this.playing) {
                // fixme нельзя напрямую менять dom других элементов Для этого у нас есть объекты, свойства, методы Переделай ok
                this.removePlaying();
            }
            // fixme так писать нельзя Такое допустимо если нужно вызвать метод, а тут присвоение идет, менять на if else ok
            if (this.isCurrentTrack()) {
                this.updateAction();
            }
            else {
                this.audio.src = this.src;
            }
            this.initEventsAudio();
        });
        this.$context.find('.bar').on('click', (event) => {
            if (this.isCurrentTrack()) {
                let wight_px = event.pageX;
                this.audio.currentTime = (this.getWightRulerPctPlayerFromWightPx(wight_px) * this.audio.duration) / 100;
            }
        });
    }
    removePlaying() {
        this.$context.siblings().removeClass('playing');
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
            this.currentTimeText = this.audio.currentTime;
        };
        this.audio.onloadedmetadata = () => {
            this.updateAction();
            this.durationText = this.audio.duration;
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
    set currentTimeText(current_time) {
        this.$context.find('.current_time').text(Player.convertSecToMin(current_time));
    }
    set durationText(duration) {
        this.$context.find('.duration').text('/ ' + Player.convertSecToMin(duration));
    }
    set currentTime(current_time) {
        this.audio.currentTime = current_time;
    }
    // fixme метод может быть static ok
    static convertSecToMin(sec = 0) {
        let min = Math.floor(Math.trunc(sec / 60));
        sec = Math.floor(sec % 60);
        if (sec < 10) {
            return min + ':0' + sec;
        }
        else {
            return min + ':' + sec;
        }
    }
    // fixme не надо выносить в функцию, используется один раз ok
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
