class CenterTitle {
    constructor(agent) {
        this.agent = agent;
        
        // Initial position. 
        this.curPos = createVector(0, 0);
        this.curSize = createVector(screen.width, screen.height);
        
        // Final position.
        this.finalPos = createVector(gifWidth, 3*gifHeight);
        this.finalSize = createVector(4*gifWidth, 2*gifHeight);

        // Animation counter.
        this.aniCounter = 0.0;
        this.curOpacity = 0.95;
        this.finalOpacity = 0; 

        // Dom element. 
        this.el = createElement('div', "Babble Wall"); 
        this.setMiddleScreen();

        this.img = createImg('assets/ring.svg');
        this.img.style('opacity', 0);
        this.img.position(this.finalPos.x, this.finalPos.y);
        this.img.size(this.finalSize.x - 30, this.finalSize.y - 30);

        // Styles. 
        this.el.style("opacity", this.curOpacity);
        this.el.style("font-family", "'Indie Flower', cursive");
        this.el.style("letter-spacing", '5px');
        this.el.style('font-size', '90px');
        this.el.style("color", "#ffbf00");
        this.el.style('display', 'flex');
        this.el.style("align-items", "center");
        this.el.style('background-image', 'linear-gradient(to bottom right, #5E0000, #800000)');
        this.el.style("justify-content", "center");
        this.el.style("text-align", "center");
        this.el.style("padding", "15px");
        this.el.style('overflow', 'hidden');
        this.el.style('position', 'fixed');

        // Saved text // Push another.
        this.setTitle("I'm Listening");

        // Create a simple button which one needs to click on to run the app
        this.startAppButton = createButton('Click Here');
        this.startAppButton.position(this.finalPos.x, this.finalPos.y);
        this.startAppButton.size(this.finalSize.x, this.finalSize.y); 
        this.startAppButton.style('background-image', 'linear-gradient(to bottom right, #5E0000, #800000)');
        this.startAppButton.style("color", "#ffbf00");
        this.startAppButton.style('font-size', '60px');
        this.startAppButton.mousePressed(() => { // This format binds this pointer
            this.startAppButton.hide();
        }); 
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

    setFullScreen() {
        this.el.position(this.curPos.x, this.curPos.y);
        this.el.size(this.curSize.x - 30, this.curSize.y  - 30);
    }

    setMiddleScreen() {
        this.el.position(this.finalPos.x, this.finalPos.y);
        this.el.size(this.finalSize.x - 30, this.finalSize.y - 30);
    }
};