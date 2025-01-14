class Player
{
    static readonly EVENT_UPDATE_ACTION = 'Player.EVENT_UPDATE_ACTION';

    public $context: JQuery;
    private audio: HTMLAudioElement;
    private $next: JQuery;
    private $previous: JQuery;

    constructor($context: JQuery)
    {
        this.$context = $context;

        this.audio = <HTMLAudioElement>$('body').find('audio')[0];

        // @ts-ignore
        if (this.$context[0].Player) return;

        // @ts-ignore
        this.$context[0].Player = this;

        this.$next = this.$context.find('.next');
        this.$previous = this.$context.find('.previous');

        // Метод нужен , чтобы после загрузки страницы можно было сразу воспользовать плеером, не выбирая сам песню
        this.initFirstSong();

        this.bindEventsAction();
    }

    private bindEventsAction()
    {
        this.$next.on('click',() =>
        {
            this.playNextSong();
        });

        this.$previous.on('click',() =>
        {
            this.playPreviousSong();
        });

        this.initEventsAudio();

        this.$context.find('.play').on('click',() =>
        {
            this.updateAction();
        });

        this.$context.find('.bar').on('click',(event) =>
        {
            let wight_px :number = event.pageX;
            this.currentTime = (this.getWightRulerPctPlayerFromWightPx(wight_px) * this.duration) / 100;
        });
    }

    private initFirstSong()
    {
        if (!this.audio.src) {
            let mini_players : MiniPlayers[] =  MiniPlayers.create();
            this.audio.src = mini_players[0].src;
            this.makeDisabled(this.$previous, true);
        }
    }

    public updateAction()
    {
        this.playing
            ? this.pause()
            : this.play();
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
            this.playNextSong();
        };

        this.audio.onloadedmetadata = () => {
            this.$context.removeClass('playing');
            this.updateAction();
            this.durationText = this.duration;
        }
    }

    private playNextSong()
    {
        let mini_players : MiniPlayers[] =  MiniPlayers.create();

        let current_index :number = this.getIndexSong() + 1;

        this.audio.src = mini_players[current_index].src;

        let last_index: number = mini_players.length-1 ;

        if (current_index < last_index) {
            this.makeDisabled(this.$previous, false);

        } else  {
            this.makeDisabled(this.$next, true);
        }
    }

    private playPreviousSong()
    {
        let mini_players : MiniPlayers[] =  MiniPlayers.create();

        let current_index :number = this.getIndexSong() - 1;

        this.audio.src = mini_players[current_index].src;

        if (current_index > 0) {
            this.makeDisabled(this.$next, false);

        } else {
            this.makeDisabled(this.$previous, true);
        }
    }

    private getIndexSong():number
    {
        let mini_players : MiniPlayers[] =  MiniPlayers.create();
        let index_active_song :number;

        mini_players.forEach((mini_player, index) =>
        {
            if (decodeURI(mini_player.src) == decodeURI(this.audio.src.split('/').pop())) {
                index_active_song = index;
                return;
            }
        })

        return index_active_song;
    }

    private getWightRulerPctPlayerFromWightPx(wight_px :number): number
    {
        let wight_ruler_px:number = (wight_px - this.$context.find('.slider').offset().left);

        return (wight_ruler_px * 100) / this.wightSliderPx ;
    }

    private getWightRulerPctAudio() : number
    {
        return (this.currentTime * 100) /this.duration;
    }

    private get wightSliderPx() :number
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

    private set durationText(duration :number)
    {
         this.$context.find('.duration').text(Player.formatTime(duration));
    }

    public set src(src: string)
    {
        this.audio.src = src;
    }

    public get src() :string
    {
        return  this.audio.src;
    }

    // todo добавить метод get ok
    public set currentTime(current_time: number)
    {
        this.audio.currentTime = current_time;
    }

    public get currentTime(): number
    {
        return this.audio.currentTime;
    }

    // todo добавить метод get duration ok
    public get duration(): number
    {
        return this.audio.duration;
    }

    // fixme переименуй в formatTime ok
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

    private set playing(playing)
    {
        playing
            ? this.$context.removeClass('playing')
            : this.$context.addClass('playing slash');

    }

    private get playing() :boolean
    {
        return this.$context.hasClass('playing');
    }

    private makeDisabled (button, is_disabled : boolean)
    {
        button.attr('disabled', is_disabled);
    }

    public static create($context = $('.b_player')): Player
    {
        return new Player($context);
    }
}