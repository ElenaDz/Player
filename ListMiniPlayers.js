class ListMiniPlayers {
    constructor($context) {
        this.$context = $context;
        this.mini_players = MiniPlayers.create(this.$context.find('.b_mini_player'));
        this.$context.find('.b_mini_player').on('click', () => {
            this.$context.siblings().removeClass('active');
            this.is_active = this.is_active;
        });
    }
    checkListByMiniPlayerId(id) {
        let hasMinPlayer = false;
        this.mini_players.forEach((mini_players) => {
            if (mini_players.id == id) {
                hasMinPlayer = true;
            }
        });
        if (!hasMinPlayer) {
            this.is_active = true;
        }
    }
    set is_active(is_active) {
        is_active
            ? this.$context.removeClass('active')
            : this.$context.addClass('active');
    }
    get is_active() {
        return this.$context.hasClass('active');
    }
    static create($context = $('.b_list_mini_players')) {
        let $list_mini_players = $context;
        let list_mini_players = [];
        $list_mini_players.each((index, element) => {
            let list_mini_player = $(element);
            list_mini_players.push(new ListMiniPlayers(list_mini_player));
        });
        return list_mini_players;
    }
}
