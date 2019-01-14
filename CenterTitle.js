class CenterTitle {
    constructor() {
        // Animating props. 
        this.animating = true; 
        this.listening = false;
        this.hide = false;

        this.curPos = createVector(0, 0);
        this.finalPos = createVector(2*gifWidth, 3*gifHeight);

        this.curSize = createVector(screen.width, screen.height);
        this.finalSize = createVector(4*gifWidth-30, 2*gifHeight-30);

        this.aniCounter = 0.0;
        this.curOpacity = 0.95;
        this.finalOpacity = 0; 

        // Dom element. 
        this.el = createElement('div', "Babble Wall"); 
        this.el.position(this.curPos.x, this.curPos.y); 
        this.el.size(this.curSize.x, this.curSize.y);

        // Styles. 
        this.el.style("opacity", this.curOpacity);
        this.el.style("font-family", 'Anton');
        this.el.style("letter-spacing", '10px');
        this.el.style('font-size', '70px');
        this.el.style("color", "#ffbf00");
        this.el.style('display', 'flex');
        this.el.style("align-items", "center");
        this.el.style('background-image', 'linear-gradient(to bottom right, #5E0000, #800000)');
        //this.el.style('background-color', '#800000');
        this.el.style("justify-content", "center");
        this.el.style("text-align", "center");
        this.el.style("padding", "15px");

        // Voice text counter
        this.timer; 

    }

    run(initVoiceCbk) {
        if (this.animating) {
            this.animate(initVoiceCbk);
        }

        if (this.listening) {
            this.listen();
        }

        // Hide the center tile.
        if (this.hide) {
            this.el.style('opacity', 1);
            this.el.style('background-image', 'linear-gradient(to bottom right, red, green)');
            this.el.html('');

            // Reset aniCounter to start animation from the beginning. 
            this.aniCounter = 0;
        }
    }

    // Animation logic here. 
    animate(initVoiceCbk) {
        // Let's lerp opacity.
        this.curOpacity = lerp(this.curOpacity, this.finalOpacity, 0.01);
        this.el.style("opacity", this.curOpacity);
        
        // Let's lerp size.
        this.curSize = this.curSize.lerp(this.finalSize, 0.05);
        this.el.size(this.curSize.x, this.curSize.y);

        // Let's lerp position.
        this.curPos = this.curPos.lerp(this.finalPos, 0.05);
        this.el.position(this.curPos.x, this.curPos.y);

        // End animation logic. 
        var d = p5.Vector.dist(this.curSize, this.finalSize);
        if (d < 1) {
            print (this.curOpacity);
            this.animating = false;

            // Hide the Center Tile and initialize voice. 
            this.el.style('opacity', 0);
            this.el.html("I'm Listening");
            initVoiceCbk();
        }
    }

    listen() {
        this.el.html("I'm Listening");
        this.el.style('background-image', 'linear-gradient(to bottom right, #5E0000, #800000)');
        this.aniCounter += 0.1; 
        // // Do nothing right now. 
        var o = map(cos(this.aniCounter), -1, 1, 0.9, 0.5);
        this.el.style('opacity', o);

        // Draw a pattern here of lines. 
        // for (var i = this.curPos.x; i < this.curPos.x + this.curSize.x; i+=5) {
        //    fill(0)
        //    ellipse(i, this.curPos.y, 10, 10);     
        // }


        // // Check here when to revert back to the old text. 
        // if (millis() - this.timer > 15000) { // 60 seconds
        //     this.el.style('font-size', '80px');
        //     this.el.html("I'm Listening");
        // }
    }

    setVoiceText(text) {
        // Revisit this based on how things look. 
        var t = "Excellent. I heard you say '" + text + "'. Updating the wall.";

        if (t.length > 10) {
            this.el.style('font-size', '60px');
        }

        if (t.length > 15) {
            this.el.style('font-size', '40px');
        }

        if (t.length > 20) {
            this.el.style('font-size', '20px');
        }
        // Update to new text and restart timer. 
        this.el.html(t);
        this.timer = millis();
    }
};