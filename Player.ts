class Player
{
    static readonly EVENT_UPDATE_ACTION = 'Player.EVENT_UPDATE_ACTION';
    static readonly EVENT_CHANGE_SONG = 'Player.EVENT_CHANGE_SONG';

    public $context: JQuery;
    private audio: HTMLAudioElement;
    private list_mini_players: ListMiniPlayers[];
    private readonly $next: JQuery;
    private readonly $previous: JQuery;

    constructor($context: JQuery)
    {
        this.$context = $context;

        this.audio = <HTMLAudioElement>$('body').find('audio')[0];
        this.$next = this.$context.find('.next');
        this.$previous = this.$context.find('.previous');

        // @ts-ignore
        if (this.$context[0].Player) return;

        // @ts-ignore
        this.$context[0].Player = this;

        this.makeAllDisabled();

        this.list_mini_players  =  ListMiniPlayers.create();

        this.bindEventsAction();
    }


    private bindEventsAction()
    {
        this.initEventsAudio();

        this.$context.find('.play').on('click',() =>
        {
            this.updateAction();
        });

        this.$next.on('click',() =>
        {
            this.playNextSong();
        });

        this.$previous.on('click',() =>
        {
            this.playPreviousSong();
        });

        this.$context.find('.bar').on('click',(event) =>
        {
            let wight_px :number = event.pageX;
            this.currentTime = (this.getWightRulerPctPlayerFromWightPx(wight_px) * this.duration) / 100;
        });

        this.$context.on(Player.EVENT_CHANGE_SONG,() =>
        {
            this.playNextSong();
        })
    }

    private initEventsAudio()
    {
        this.audio.onplay = () => {
            this.playing = this.playing;
            this.$context.trigger(Player.EVENT_UPDATE_ACTION)
        };

        this.audio.onpause = () => {
            this.playing = this.playing;
            this.$context.trigger(Player.EVENT_UPDATE_ACTION)
        };

        this.audio.ontimeupdate = () => {
            this.wightRulerPct = this.getWightRulerPctAudio();
            this.currentTimeText = this.currentTime
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
        }
    }

    private makeDisabledNextPrevious()
    {
        if (this.getLastIndex()) {
            if (this.getIndexSong() == 0) {
                this.makeDisabled(this.$previous, true);
                this.makeDisabled(this.$next, false);

            } else if (this.getIndexSong() == this.getLastIndex()) {
                this.makeDisabled(this.$next, true);
                this.makeDisabled(this.$previous, false);

            } else {
                this.makeDisabled(this.$previous, false);
                this.makeDisabled(this.$next, false);
            }

        } else if (!this.getLastIndex()) {
            this.makeDisabled(this.$previous, true);
            this.makeDisabled(this.$next, true);
        }
    }

    private getLastIndex(): number
    {
        let last_index: number;

        this.list_mini_players.forEach((list_mini_players: ListMiniPlayers) =>
        {
            list_mini_players.checkListByMiniPlayerId(this.miniPlayerId);

            if (list_mini_players.is_active) {
                last_index = list_mini_players.mini_players.length - 1 ;
            }
        })

        return last_index;
    }

    public getIndexSong(): number
    {
        let index_active_song: number;

        this.list_mini_players.forEach((list_mini_players: ListMiniPlayers) =>
        {
            if (list_mini_players.is_active) {
                list_mini_players.mini_players.forEach((mini_player :MiniPlayers, index: number) =>
                {
                    if (this.is_not_change_src(mini_player)) {
                        index_active_song = index;
                        return;
                    }
                })
            }
        })

        return index_active_song;
    }

    private is_not_change_src(mini_player: MiniPlayers): boolean
    {
        return decodeURI(mini_player.src.split('/').pop()) == decodeURI(this.src.split('/').pop());
    }

    private playNextSong()
    {
        let current_index :number = this.getIndexSong() + 1;

        this.list_mini_players.forEach((list) =>
        {
            if (list.is_active) {
                if (current_index < list.mini_players.length) {
                    this.src = list.mini_players[current_index].src;
                    this.miniPlayerId = list.mini_players[current_index].id;
                }
            }
        })
    }

    private playPreviousSong()
    {
        let current_index :number = this.getIndexSong() - 1;

        this.list_mini_players.forEach((list) =>
        {
            if (list.is_active) {
                if (current_index >= 0) {
                    this.src = list.mini_players[current_index].src;
                    this.miniPlayerId = list.mini_players[current_index].id;
                }
            }
        })
    }

    public updateAction()
    {
        this.playing
            ? this.pause()
            : this.play();
    }

    public set miniPlayerId(id: number)
    {
        this.$context.data('mini_player_id', id);
    }
    public get miniPlayerId(): number
    {
        return this.$context.data('mini_player_id');
    }

    private makeAllDisabled()
    {
        this.makeDisabled(this.$previous, true);
        this.makeDisabled(this.$next, true);
        this.makeDisabled(this.$context.find('.play'), true);
    }

    private getWightRulerPctPlayerFromWightPx(wight_px :number): number
    {
        let wight_ruler_px:number = (wight_px - this.$context.find('.slider').offset().left);

        return (wight_ruler_px * 100) / this.wightSliderPx;
    }

    private getWightRulerPctAudio(): number
    {
        return (this.currentTime * 100) /this.duration;
    }

    private get wightSliderPx(): number
    {
        return this.$context.find('.slider').width();
    }

    private set wightRulerPct(wight: number)
    {
        this.$context.find('.ruler').width(wight + '%');
    }

    public pause()
    {
        this.audio.pause();
    }

    public play()
    {
        this.audio.play();
    }

    private set currentTimeText(current_time: number)
    {
        this.$context.find('.current_time').text(Player.formatTime(current_time));
    }

    private set durationText(duration: number)
    {
         this.$context.find('.duration').text(Player.formatTime(duration));
    }

    public set src(src: string)
    {
        this.audio.src = src;
    }

    public get src(): string
    {
        return this.audio.src;
    }

    public set currentTime(current_time: number)
    {
        this.audio.currentTime = current_time;
    }

    public get currentTime(): number
    {
        return this.audio.currentTime;
    }

    public get duration(): number
    {
        return this.audio.duration;
    }

    private static formatTime(sec = 0)
    {
        let min = Math.floor(Math.trunc(sec / 60));

        sec  = Math.floor(sec % 60);

        if (sec < 10) {
            return min + ':0' + sec
        } else {
            return min + ':' +  sec;
        }
    }

    private set playing(playing: boolean)
    {
        playing
            ? this.$context.removeClass('playing')
            : this.$context.addClass('playing slash');
    }

    private get playing(): boolean
    {
        return this.$context.hasClass('playing');
    }

    public makeDisabled (button, is_disabled: boolean)
    {
        button.attr('disabled', is_disabled);
    }

    public static create($context = $('.b_player')): Player
    {
        return new Player($context);
    }
}