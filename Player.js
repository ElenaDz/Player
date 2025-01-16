class Player {
    constructor($context) {
        this.$context = $context;
        this.audio = $('body').find('audio')[0];
        // @ts-ignore
        if (this.$context[0].Player)
            return;
        // @ts-ignore
        this.$context[0].Player = this;
        this.mini_players = MiniPlayers.create();
        this.$next = this.$context.find('.next');
        this.$previous = this.$context.find('.previous');
        this.bindEventsAction();
    }
    bindEventsAction() {
        this.$next.on('click', () => {
            this.playNextSong();
        });
        this.$previous.on('click', () => {
            this.playPreviousSong();
        });
        this.initEventsAudio();
        this.$context.find('.play').on('click', () => {
            this.updateAction();
        });
        this.$context.find('.bar').on('click', (event) => {
            let wight_px = event.pageX;
            this.currentTime = (this.getWightRulerPctPlayerFromWightPx(wight_px) * this.duration) / 100;
        });
    }
    updateAction() {
        this.playing
            ? this.pause()
            : this.play();
    }
    initEventsAudio() {
        this.audio.onplay = () => {
            this.playing = this.playing;
            this.$context.trigger(Player.EVENT_UPDATE_ACTION);
        };
        this.audio.onpause = () => {
            this.playing = this.playing;
            this.$context.trigger(Player.EVENT_UPDATE_ACTION);
        };
        this.audio.ontimeupdate = () => {
            this.wightRulerPct = this.getWightRulerPctAudio();
            this.currentTimeText = this.currentTime;
        };
        this.audio.onended = () => {
            this.playNextSong();
        };
        this.audio.onloadedmetadata = () => {
            this.changeDisabled();
            this.$context.removeClass('playing');
            this.updateAction();
            this.durationText = this.duration;
        };
    }
    changeDisabled() {
        let last_index = this.mini_players.length - 1;
        if (this.getIndexSong() == 0) {
            this.makeDisabled(this.$previous, true);
            this.makeDisabled(this.$next, false);
        }
        else if (this.getIndexSong() == last_index) {
            this.makeDisabled(this.$next, true);
            this.makeDisabled(this.$previous, false);
        }
        else {
            this.makeDisabled(this.$previous, false);
            this.makeDisabled(this.$next, false);
        }
    }
    playNextSong() {
        let current_index = this.getIndexSong() + 1;
        this.audio.src = this.mini_players[current_index].src;
    }
    playPreviousSong() {
        let current_index = this.getIndexSong() - 1;
        this.audio.src = this.mini_players[current_index].src;
    }
    getIndexSong() {
        let index_active_song;
        this.mini_players.forEach((mini_player, index) => {
            if (decodeURI(mini_player.src) == decodeURI(this.audio.src.split('/').pop())) {
                index_active_song = index;
                return;
            }
        });
        return index_active_song;
    }
    getWightRulerPctPlayerFromWightPx(wight_px) {
        let wight_ruler_px = (wight_px - this.$context.find('.slider').offset().left);
        return (wight_ruler_px * 100) / this.wightSliderPx;
    }
    getWightRulerPctAudio() {
        return (this.currentTime * 100) / this.duration;
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
    set currentTimeText(current_time) {
        this.$context.find('.current_time').text(Player.formatTime(current_time));
    }
    set durationText(duration) {
        this.$context.find('.duration').text(Player.formatTime(duration));
    }
    set src(src) {
        this.audio.src = src;
    }
    get src() {
        return this.audio.src;
    }
    // todo добавить метод get ok
    set currentTime(current_time) {
        this.audio.currentTime = current_time;
    }
    get currentTime() {
        return this.audio.currentTime;
    }
    // todo добавить метод get duration ok
    get duration() {
        return this.audio.duration;
    }
    // fixme переименуй в formatTime ok
    static formatTime(sec = 0) {
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
            : this.$context.addClass('playing slash');
    }
    get playing() {
        return this.$context.hasClass('playing');
    }
    makeDisabled(button, is_disabled) {
        button.attr('disabled', is_disabled);
    }
    static create($context = $('.b_player')) {
        return new Player($context);
    }
}
Player.EVENT_UPDATE_ACTION = 'Player.EVENT_UPDATE_ACTION';
