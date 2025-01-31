class Player {
    constructor($context) {
        this.$context = $context;
        this.audio = $('body').find('audio')[0];
        this.$next = this.$context.find('.next');
        this.$previous = this.$context.find('.previous');
        // @ts-ignore
        if (this.$context[0].Player)
            return;
        // @ts-ignore
        this.$context[0].Player = this;
        this.makeAllDisabled();
        this.list_mini_players = ListMiniPlayers.create();
        this.bindEventsAction();
    }
    bindEventsAction() {
        this.initEventsAudio();
        this.$context.find('.play').on('click', () => {
            this.updateAction();
        });
        this.$next.on('click', () => {
            this.playNextSong();
        });
        this.$previous.on('click', () => {
            this.playPreviousSong();
        });
        this.$context.find('.bar').on('click', (event) => {
            let wight_px = event.pageX;
            this.currentTime = (this.getWightRulerPctPlayerFromWightPx(wight_px) * this.duration) / 100;
        });
        this.$context.on(Player.EVENT_CHANGE_SONG, () => {
            this.playNextSong();
        });
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
            this.$context.trigger(Player.EVENT_CHANGE_SONG);
        };
        this.audio.onloadedmetadata = () => {
            this.makeDisabled(this.$context.find('.play'), false);
            this.$context.removeClass('playing');
            this.updateAction();
            this.durationText = this.duration;
            this.makeDisabledNextPrevious();
        };
    }
    makeDisabledNextPrevious() {
        if (this.getLastIndex()) {
            if (this.getIndexSong() == 0) {
                this.makeDisabled(this.$previous, true);
                this.makeDisabled(this.$next, false);
            }
            else if (this.getIndexSong() == this.getLastIndex()) {
                this.makeDisabled(this.$next, true);
                this.makeDisabled(this.$previous, false);
            }
            else {
                this.makeDisabled(this.$previous, false);
                this.makeDisabled(this.$next, false);
            }
        }
        else if (!this.getLastIndex()) {
            this.makeDisabled(this.$previous, true);
            this.makeDisabled(this.$next, true);
        }
    }
    getLastIndex() {
        let last_index;
        this.list_mini_players.forEach((list_mini_players) => {
            list_mini_players.checkListByMiniPlayerId(this.miniPlayerId);
            if (list_mini_players.is_active) {
                last_index = list_mini_players.mini_players.length - 1;
            }
        });
        return last_index;
    }
    getIndexSong() {
        let index_active_song;
        this.list_mini_players.forEach((list_mini_players) => {
            if (list_mini_players.is_active) {
                list_mini_players.mini_players.forEach((mini_player, index) => {
                    if (this.is_not_change_src(mini_player)) {
                        index_active_song = index;
                        return;
                    }
                });
            }
        });
        return index_active_song;
    }
    is_not_change_src(mini_player) {
        return decodeURI(mini_player.src.split('/').pop()) == decodeURI(this.src.split('/').pop());
    }
    playNextSong() {
        let current_index = this.getIndexSong() + 1;
        this.list_mini_players.forEach((list) => {
            if (list.is_active) {
                if (current_index < list.mini_players.length) {
                    this.src = list.mini_players[current_index].src;
                    this.miniPlayerId = list.mini_players[current_index].id;
                }
            }
        });
    }
    playPreviousSong() {
        let current_index = this.getIndexSong() - 1;
        this.list_mini_players.forEach((list) => {
            if (list.is_active) {
                if (current_index >= 0) {
                    this.src = list.mini_players[current_index].src;
                    this.miniPlayerId = list.mini_players[current_index].id;
                }
            }
        });
    }
    updateAction() {
        this.playing
            ? this.pause()
            : this.play();
    }
    set miniPlayerId(id) {
        this.$context.data('mini_player_id', id);
    }
    get miniPlayerId() {
        return this.$context.data('mini_player_id');
    }
    makeAllDisabled() {
        this.makeDisabled(this.$previous, true);
        this.makeDisabled(this.$next, true);
        this.makeDisabled(this.$context.find('.play'), true);
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
    set currentTime(current_time) {
        this.audio.currentTime = current_time;
    }
    get currentTime() {
        return this.audio.currentTime;
    }
    get duration() {
        return this.audio.duration;
    }
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
Player.EVENT_CHANGE_SONG = 'Player.EVENT_CHANGE_SONG';
