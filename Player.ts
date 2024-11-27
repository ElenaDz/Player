class Player
{
    private $context: JQuery;
    private audio: HTMLAudioElement

    constructor($context: JQuery)
    {
        this.$context = $context;

        this.audio  = this.getAudio()

        this.buildEvent();

        this.$context.find('.play').on('click',() =>
        {
            this.getPlaying()
                ? this.setPause()
                : this.setPlay();
        })

        this.$context.find('.bar').on('click',(event) =>
        {
            let played_excerpt = this.calculatePlayerPlayedExcerpt(event);

            this.audio.currentTime = (played_excerpt * this.audio.duration) / this.wightSlider;
        })
    }

    private buildEvent()
    {
        this.audio.onplay = () => {
            this.addActive();
        };

        this.audio.onpause = () => {
            this.removeActive();
        };

        this.audio.ontimeupdate = () => {
            this.ruler = this.calculateAudioPlayedExcerpt();
        };
    }

    private calculatePlayerPlayedExcerpt(event : JQueryEventObject): number
    {
        return ((event.pageX - this.$context.find('.slider').offset().left) * 100) / this.wightSlider ;
    }

    private calculateAudioPlayedExcerpt() : number
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

    private getPlaying() :boolean
    {
        return this.$context.hasClass('active');
    }

    private setPause()
    {
        this.audio.pause();

        this.removeActive();
    }

    private setPlay()
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