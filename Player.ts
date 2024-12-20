class Player
{
    private $context: JQuery;
    private audio: HTMLAudioElement

    constructor($context: JQuery)
    {
        this.$context = $context;

        this.audio = <HTMLAudioElement>$('body').find('audio')[0];

        this.$context.find('.play').on('click',() =>
        {
            if ( ! this.playing) {
                // fixme ты ни чего не исправила все так же меняет dom не этого плеера а соседнего, так нельзя
                //  нужно получить все объекты плееров на странице и задать их свойство playing, выносить в отдельную функцию не нужно
                this.removePlaying();
            }

            if (this.isCurrentTrack()) {
                this.updateAction();

            } else {
                this.audio.src = this.src;
            }

            this.initEventsAudio();
        })

        this.$context.find('.bar').on('click',(event) =>
        {
            if (this.isCurrentTrack()) {
                let wight_px :number = event.pageX;

                this.audio.currentTime = (this.getWightRulerPctPlayerFromWightPx(wight_px) * this.audio.duration) / 100;
            }
        })
    }

    private removePlaying()
    {
        this.$context.siblings().removeClass('playing');
    }

    private isCurrentTrack() :boolean
    {
        let src_audio  = decodeURI(this.audio.src).toLowerCase();
        let src_player = decodeURI(this.src).toLowerCase();

        return src_audio.includes(src_player);
    }

    private updateAction()
    {
        this.playing
            ? this.pause()
            : this.play();
    }

    private initEventsAudio()
    {
        this.audio.onplay = () => {
            this.playing = this.playing;
        };

        this.audio.onpause = () => {
            this.playing = this.playing;
        };

        this.audio.ontimeupdate = () => {
            this.wightRulerPct = this.getWightRulerPctAudio();
            this.currentTimeText = this.audio.currentTime
        };

        this.audio.onloadedmetadata = () => {
            this.updateAction();
            this.durationText = this.audio.duration;
        }
    }

    private getWightRulerPctPlayerFromWightPx(wight_px :number): number
    {
        let wight_ruler_px:number = (wight_px - this.$context.find('.slider').offset().left);

        return (wight_ruler_px * 100) / this.wightSliderPx ;
    }

    private getWightRulerPctAudio() : number
    {
        return (this.audio.currentTime * 100) /this.audio.duration;
    }

    private get wightSliderPx() :number
    {
        return this.$context.find('.slider').width();
    }

    private set wightRulerPct(wight: number)
    {
        this.$context.find('.ruler').width(wight + '%')
    }

    public pause()
    {
        this.audio.pause();
    }

    public play()
    {
        this.audio.play();
    }

    public set src(src: string)
    {
        this.$context.data('src', src);
    }

    public get src() :string
    {
        return this.$context.data('src');
    }

    private set currentTimeText(current_time: number)
    {
        this.$context.find('.current_time').text(Player.convertSecToMin(current_time));
    }

    private set durationText(duration :number)
    {
         this.$context.find('.duration').text('/ ' + Player.convertSecToMin(duration));
    }

    // todo добавить метод get
    public set currentTime(current_time: number)
    {
        this.audio.currentTime = current_time;
    }

    // todo добавить метод get duration

    // fixme переименуй в formatTime
    private static convertSecToMin(sec = 0)
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
            : this.$context.addClass('playing');
    }

    private get playing() :boolean
    {
        return this.$context.hasClass('playing');
    }

    public static create($context = $('.b_player')): Player[]
    {
        let $players = $context;
        let players: Player[] = [];

        $players.each((index, element) => {
            let player = $(element);
            players.push(new Player(player));
        })

        return players;
    }
}