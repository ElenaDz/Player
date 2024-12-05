class Player {
    constructor($context) {
        this.$context = $context;
        this.audio = $('body').find('audio')[0];
        this.$context.find('.play').on('click', () => {
            if (!this.playing) {
                // fixme ты ни чего не исправила все так же меняет dom не этого плеера а соседнего, так нельзя
                //  нужно получить все объекты плееров на странице и задать их свойство playing, выносить в отдельную функцию не нужно
                //  ты видимо не понимаешь что ты здесь хочешь сделать поэтому делаешь не правильно, ты хочешь остановить все
                //  остальные плееры, надеюсь теперь сделаешь правильно, тебе не кажется ерундой менять свойство playing когда тебе
                //  нужно остановить плеер, мне кажется, я бы выбрать для этого метод pause или stop
                this.removePlaying();
            }
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
    // todo добавить метод get
    set currentTime(current_time) {
        this.audio.currentTime = current_time;
    }
    // todo добавить метод get duration
    // fixme переименуй в formatTime
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
