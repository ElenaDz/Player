class Player
{
    private $context: JQuery;
    private audio: HTMLAudioElement

    constructor($context: JQuery)
    {
        this.$context = $context;

        this.audio  = this.getAudio()

        this.bindEvent();

        this.$context.find('.play').on('click',() =>
        {
            this.isPlaying()
                ? this.pause()
                : this.play();
        })

        this.$context.find('.bar').on('click',(event) =>
        {
            let wight_ruler = this.calculateWightRulerPlayer(event);

            this.audio.currentTime = (wight_ruler * this.audio.duration) / 100;
        })
    }

    private bindEvent()
    {
        this.audio.onplay = () => {
            this.addActive();
        };

        this.audio.onpause = () => {
            this.removeActive();
        };

        this.audio.ontimeupdate = () => {
            this.ruler = this.calculateWightRulerAudio();
        };
    }

    private calculateWightRulerPlayer(event : JQueryEventObject): number
    {
        return ((event.pageX - this.$context.find('.slider').offset().left) * 100) / this.wightSlider ;
    }

    private calculateWightRulerAudio() : number
    {
        return (this.audio.currentTime * 100) /this.audio.duration;
    }

    private get wightSlider() :number
    {
        return this.$context.find('.slider').width();
    }

    private set ruler(ruler: number)
    {
        this.$context.find('.ruler').width(ruler + '%')
    }

    private isPlaying() :boolean
    {
        return this.$context.hasClass('active');
    }

    private pause()
    {
        this.audio.pause();

        this.removeActive();
    }

    private play()
    {
        this.audio.play();

        this.addActive();
    }

    private addActive()
    {
        this.$context.addClass('active');
    }

    private removeActive()
    {
        this.$context.removeClass('active');
    }

    private getAudio():HTMLAudioElement
    {
        return <HTMLAudioElement>$('body').find('audio')[0]
    }
    public static create($context = $('.player')) : Player
    {
        return new Player($context)
    }
}