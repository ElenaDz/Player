class Player
{
    private $context: JQuery;
    public audio: HTMLAudioElement

    constructor($context: JQuery)
    {
        this.$context = $context;

        this.audio = this.getAudio();

        // fixme а ниже разве не bind Events идут в этом коде ? почему они не в этом методе Плохое имя функции
        this.bindEvent();

        this.$context.find('.play').on('click',() =>
        {
            this.isPlaying()
                ? this.pause()
                : this.play();
        })

        this.$context.find('.bar').on('click',(event) =>
        {
            let position_ruler_px :number = event.pageX;

            this.audio.currentTime = (this.getWightRulerPctPlayerFromWightPx(position_ruler_px) * this.audio.duration) / 100;
        })
    }

    private bindEvent()
    {
        this.audio.onplay = () => {
            this.addPlaying();
        };

        this.audio.onpause = () => {
            this.removePlaying();
        };

        this.audio.ontimeupdate = () => {
            this.wightRulerPct = this.getWightRulerPctAudio();
        };
    }

    // fixme в имени функции wight_px в передается position_ruler_px, ерунда передавать нужно wight_px
    private getWightRulerPctPlayerFromWightPx(position_ruler_px :number): number
    {
        let wight_ruler_px:number = (position_ruler_px - this.$context.find('.slider').offset().left);

        return ( wight_ruler_px * 100) / this.wightSliderPx ;
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

    // todo добавь публичные свойства currentTime и duration

    // fixme замени эти 3 функции свойством playing с getterом и setterом
    private addPlaying()
    {
        this.$context.addClass('playing');
    }

    private removePlaying()
    {
        this.$context.removeClass('playing');
    }

    private isPlaying() :boolean
    {
        return this.$context.hasClass('playing');
    }


    // fixme вызывается один раз, не нужно выносить в отдельную фукнцию
    private getAudio():HTMLAudioElement
    {
        return <HTMLAudioElement>$('body').find('audio')[0]
    }

    public static create($context = $('.player')) : Player
    {
        return new Player($context)
    }
}