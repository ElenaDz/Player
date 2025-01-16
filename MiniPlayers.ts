class MiniPlayers
{
    static readonly EVENT_UPDATE_PLAYING = 'MiniPlayers.EVENT_UPDATE_PLAYING';

    public $context: JQuery;
    private player: Player;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].MiniPlayers) return;

        // @ts-ignore
        this.$context[0].MiniPlayers = this;

        this.player = Player.create();

        this.$context.on('click',() =>
        {
            this.turnOffMiniPlayers();
        })

        this.player.$context.on(Player.EVENT_UPDATE_ACTION, () =>
        {
            if (decodeURI(this.src) == decodeURI(this.player.src.split('/').pop())) {
                this.playing = this.playing;
            } else {
                this.playing = true;
            }
        })
    }

    private turnOffMiniPlayers()
    {
        if ( ! this.playing) {
            let mini_players : MiniPlayers[] = MiniPlayers.create();

            mini_players.forEach((mini_player : MiniPlayers) =>
            {
                mini_player.playing = true;
            })

            this.player.src = this.src;

        } else {
            this.player.updateAction();
        }
    }

    public set src(src: string)
    {
        this.$context.data('src', src);
    }

    public get src() :string
    {
        return this.$context.data('src');
    }

    private set playing(playing)
    {
        playing
            ? this.$context.removeClass('playing')
            : this.$context.addClass('playing');
    }

    private get playing() :boolean
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