class ListMiniPlayers
{
    private $context: JQuery;
    public mini_players: MiniPlayers[];

    constructor($context: JQuery)
    {
        this.$context = $context;

        this.mini_players  =  MiniPlayers.create(this.$context.find('.b_mini_player'));

        this.$context.find('.b_mini_player').on('click',() =>
        {
            this.$context.siblings().removeClass('active');

            this.is_active = this.is_active;
        })
    }

    public checkListByMiniPlayerId (id: number)
    {
        let hasMinPlayer: boolean = false;

        this.mini_players.forEach(( mini_players : MiniPlayers ) =>
        {
            if (mini_players.id == id){
                hasMinPlayer = true;
            }
        })

        if (!hasMinPlayer){
            this.is_active = true;
        }
    }

    private set is_active(is_active: boolean)
    {
        is_active
            ? this.$context.removeClass('active')
            : this.$context.addClass('active');
    }

    public get is_active(): boolean
    {
        return this.$context.hasClass('active');
    }

    static create($context = $('.b_list_mini_players')) : ListMiniPlayers[]
    {
        let $list_mini_players: JQuery  = $context;
        let list_mini_players: ListMiniPlayers[] = [];

        $list_mini_players.each((index, element) => {
            let list_mini_player: JQuery = $(element);
            list_mini_players.push(new ListMiniPlayers(list_mini_player));
        })

        return list_mini_players;
    }
}