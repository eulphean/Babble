class CenterTitle {
    constructor(agent) {
        this.agent = agent;

        this.curPos = createVector(0, 0);
        this.finalPos = createVector(gifWidth, 3*gifHeight);

        this.curSize = createVector(screen.width, screen.height);
        this.finalSize = createVector(4*gifWidth, 2*gifHeight);

        this.aniCounter = 0.0;
        this.curOpacity = 0.95;
        this.finalOpacity = 0; 

        // Dom element. 
        this.el = createElement('div', "Babble Wall"); 
        this.el.position(this.finalPos.x, this.finalPos.y); 
        this.el.size(this.finalSize.x - 30, this.finalSize.y - 30);

        this.img = createImg('assets/ring.svg');
        this.img.style('opacity', 0);
        this.img.position(this.finalPos.x, this.finalPos.y);
        this.img.size(this.finalSize.x - 30, this.finalSize.y - 30);

        // Styles. 
        this.el.style("opacity", this.curOpacity);
        this.el.style("font-family", 'Anton');
        this.el.style("letter-spacing", '10px');
        this.el.style('font-size', '70px');
        this.el.style("color", "#ffbf00");
        this.el.style('display', 'flex');
        this.el.style("align-items", "center");
        this.el.style('background-image', 'linear-gradient(to bottom right, #5E0000, #800000)');
        this.el.style("justify-content", "center");
        this.el.style("text-align", "center");
        this.el.style("padding", "15px");

        // Saved text // Push another.
        this.setTitle("I'm Listening");
    }

    run() {
        if (agent.isSpeaking) {
            //this.el.style('background-image', 'linear-gradient(to bottom right, red, green)');
            // Reset aniCounter to start animation from the beginning. 
            this.aniCounter = 0;
            this.img.style('opacity', 1);
            this.setTitle('');

        } else {
            this.listen();
            this.img.style('opacity', 0);
        }
    }

    listen() {
        this.el.style('background-image', 'linear-gradient(to bottom right, #5E0000, #800000)');
        this.aniCounter += 0.05; 
        // // Do nothing right now. 
        var o = map(cos(this.aniCounter), -1, 1, 0.9, 0.5);
        this.el.style('opacity', o);
    }

    setTitle(text) {
        this.el.html(text);
    }
};