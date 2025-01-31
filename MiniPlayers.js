class MiniPlayers {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].MiniPlayers)
            return;
        // @ts-ignore
        this.$context[0].MiniPlayers = this;
        this.player = Player.create();
        this.bindEvents();
    }
    bindEvents() {
        this.$context.on('click', () => {
            this.turnOffMiniPlayers();
            return false;
        });
        this.player.$context.on(Player.EVENT_UPDATE_ACTION, () => {
            if (this.player.miniPlayerId == this.id) {
                this.playing = this.playing;
            }
            else {
                this.playing = true;
            }
        });
    }
    get id() {
        return this.$context.data('mini_player_id');
    }
    turnOffMiniPlayers() {
        if (!(this.player.miniPlayerId == this.id)) {
            this.player.src = this.src;
            this.player.miniPlayerId = this.id;
        }
        else {
            this.player.updateAction();
        }
    }
    set src(src) {
        this.$context.attr('href', src);
    }
    get src() {
        return this.$context.attr('href');
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
MiniPlayers.EVENT_CLICK = 'MiniPlayers.EVENT_CLICK';
