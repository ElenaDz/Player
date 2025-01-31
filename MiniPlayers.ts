class MiniPlayers
{
    static readonly EVENT_UPDATE_PLAYING = 'MiniPlayers.EVENT_UPDATE_PLAYING';
    static readonly EVENT_CLICK = 'MiniPlayers.EVENT_CLICK';

    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].MiniPlayers) return;

        // @ts-ignore
        this.$context[0].MiniPlayers = this;

        this.player = Player.create();

        this.bindEvents();
    }

    private bindEvents()
    {
        this.$context.on('click',() =>
        {
            this.turnOffMiniPlayers();

            return false;
        })

        this.player.$context.on(Player.EVENT_UPDATE_ACTION,() =>
        {
            if (this.player.miniPlayerId == this.id) {
                this.playing = this.playing;

            } else {
                this.playing = true;
            }
        })
    }

    public get id(): number
    {
        return this.$context.data('mini_player_id');
    }

    private turnOffMiniPlayers()
    {
        if ( !(this.player.miniPlayerId == this.id)){
            this.player.src = this.src;
            this.player.miniPlayerId = this.id;

        } else {
            this.player.updateAction();
        }
    }

    public set src(src: string)
    {
        this.$context.attr('href', src);
    }

    public get src(): string
    {
        return this.$context.attr('href');
    }

    public set playing(playing: boolean)
    {
        playing
            ? this.$context.removeClass('playing')
            : this.$context.addClass('playing');
    }

    public get playing(): boolean
    {
        return this.$context.hasClass('playing');
    }

    public static create($context = $('.b_mini_player')): MiniPlayers[]
    {
        let $mini_players: JQuery  = $context;
        let mini_players: MiniPlayers[] = [];

        $mini_players.each((index, element) => {
            let mini_player: JQuery = $(element);
            mini_players.push(new MiniPlayers(mini_player));
        })

        return mini_players;
    }
}