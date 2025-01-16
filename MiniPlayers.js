class MiniPlayers {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].MiniPlayers)
            return;
        // @ts-ignore
        this.$context[0].MiniPlayers = this;
        this.player = Player.create();
        this.$context.on('click', () => {
            this.turnOffMiniPlayers();
        });
        this.player.$context.on(Player.EVENT_UPDATE_ACTION, () => {
            if (decodeURI(this.src) == decodeURI(this.player.src.split('/').pop())) {
                this.playing = this.playing;
            }
            else {
                this.playing = true;
            }
        });
    }
    turnOffMiniPlayers() {
        if (!this.playing) {
            let mini_players = MiniPlayers.create();
            mini_players.forEach((mini_player) => {
                mini_player.playing = true;
            });
            this.player.src = this.src;
        }
        else {
            this.player.updateAction();
        }
    }
    set src(src) {
        this.$context.data('src', src);
    }
    get src() {
        return this.$context.data('src');
    }
    set playing(playing) {
        playing
            ? this.$context.removeClass('playing')
            : this.$context.addClass('playing');
    }
    get playing() {
        return this.$context.hasClass('playing');
    }
    static create($context = $('.b_mini_player')) {
        let $mini_players = $context;
        let mini_players = [];
        $mini_players.each((index, element) => {
            let mini_player = $(element);
            mini_players.push(new MiniPlayers(mini_player));
        });
        return mini_players;
    }
}
MiniPlayers.EVENT_UPDATE_PLAYING = 'MiniPlayers.EVENT_UPDATE_PLAYING';
