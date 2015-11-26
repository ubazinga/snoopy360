window.addEventListener("load", function(event) {
    new Snoopy360init();
}, false);

var Snoopy360init = function() {
    this.constructor = function() {
        this.options = {
            containersName: 'snoopy360'
        };

        var containers = document.getElementsByClassName(this.options.containersName);
        this.containers = Array.prototype.slice.call(containers);

        if (this.containers.length > 0) {
            this.containers.forEach(function(container) {
                new Snoopy360(container);
            });
        }
    };

    this.constructor.apply(this, arguments);
}

var Snoopy360 = function() {
    this.constructor = function(container) {
        this.container = container;

        this.options = {
            "frames": null,
            "frameWidth": null,
            "frameHeight": null,
            "currentFrame": null,
            "startPosition": null,
            "direction": "right",
            "directiodOldX": null
        }

        this.renderContainer();
        this.addEvents();
    };

    this.renderContainer = function() {
        if (this.container.getAttribute('data-frames')) {
            this.options.frames = this.container.getAttribute('data-frames');
        }

        if (this.container.getAttribute('data-width')) {
            var width = this.container.getAttribute('data-width');
            
            if(this.container.parentNode.offsetWidth < parseInt(width)) {
                width = this.container.parentNode.offsetWidth + 'px';
            }

            this.container.style.width = width;
        } else {
            this.container.style.width = this.container.parentNode.offsetWidth + 'px';
        }

        if (this.container.getAttribute('data-height')) {
            var height = this.container.getAttribute('data-height');

            if(width != this.container.getAttribute('data-width')) {
                height = ((parseInt(height) * parseInt(width)) / parseInt(this.container.getAttribute('data-width'))) + 'px';
            }

            this.container.style.height = height;
        }

        if (this.container.querySelector('.snoopy360-sprite')) {
            var sprite = this.container.querySelector('.snoopy360-sprite');

            sprite.setAttribute('src', sprite.getAttribute('data-src'));

            sprite.style.visibility = 'hidden';

            this.container.style.background = 'url(' + sprite.getAttribute('src') + ')';
            this.container.style.backgroundSize = 'auto ' + this.container.offsetHeight + 'px';
        }

        this.container.spriteWidth = this.getSpriteWidth();
    }

    this.render = function(frame) {
        console.info('this.render', "-" + (frame * this.container.offsetWidth) + "px 0");
        this.container.style.backgroundPosition = "-" + (frame * this.container.offsetWidth) + "px 0";
    };

    this.frames = function() {
        // console.info('this.frames', this.container.spriteWidth / this.container.offsetWidth);
        return parseInt(this.container.spriteWidth / this.container.offsetWidth);
    };

    this.getFrame = function(positionX) {
        this.options.frames = this.options.frames ? this.options.frames : this.frames();
        this.options.frameWidth = this.container.offsetWidth / this.options.frames;

        if (!this.options.currentFrame) {
            this.options.currentFrame = this.options.frames;
        }

        if (this.getDirection(positionX) == 'right') {
            if (this.options.startPosition + this.options.frameWidth < positionX) {
                this.options.currentFrame--;
                this.options.startPosition = positionX;

                if (this.options.currentFrame < 1) {
                    this.options.currentFrame = this.options.frames;
                }
            }
        } else {
            if (this.options.startPosition - this.options.frameWidth > positionX) {
                this.options.currentFrame++;
                this.options.startPosition = positionX;

                if (this.options.currentFrame > this.options.frames) {
                    this.options.currentFrame = 1;
                }
            }
        }

        return this.options.currentFrame;
    };

    this.getDirection = function(pageX) {
        if (pageX < this.options.directiodOldX) {
            this.options.direction = "left";
        } else if (pageX > this.options.directiodOldX) {
            this.options.direction = "right";
        }

        this.options.directiodOldX = pageX;

        return this.options.direction;
    };

    this.getSpriteWidth = function() {
        var styles = window.getComputedStyle(this.container, null),
            image = new Image;
        image.src = styles.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];

        image.addEventListener('load', function() {
            this.container.classList.add("loaded");
            this.container.spriteWidth = (image.width * this.container.offsetHeight) / image.height;
        }.bind(this), false)
    };

    this.addEvents = function() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.container.addEventListener('touchstart', function(e) {
                e.preventDefault()
            }, false)

            this.container.addEventListener('touchmove', function(e) {
                touchobj = event.changedTouches[0]
                // console.info(touchobj.clientX, touchobj instanceof Touch);
                e.preventDefault()
            }, false);

            this.container.addEventListener('touchstart', this.touchstartEventListener.bind(this), false);
            this.container.addEventListener('touchend', this.touchendEventListener.bind(this), false);
            this.container.addEventListener('touchmove', this.touchmoveEventLinstener.bind(this), false);

        } else {
            window.addEventListener('mouseup', this.mouseupEventListener.bind(this), false);
            this.container.addEventListener('mousedown', this.mousedownEventListener.bind(this), false);
            window.addEventListener('mousemove', this.moveEventLinstener.bind(this), false);
        }

        window.addEventListener('resize', this.renderContainer.bind(this), false);
    };


    this.mouseupEventListener = function(event) {
        this.pressed = false;

        this.options.startPosition = null;
    };

    this.mousedownEventListener = function(event) {
        this.options.startPosition = event.offsetX || event.layerX;

        this.pressed = true;
    };

    this.moveEventLinstener = function(event) {
        if (this.pressed) {
            // console.info(this.getFrame(event.offsetX || event.layerX));
            return this.render(this.getFrame(event.offsetX || event.layerX));
        }
    };

    this.touchendEventListener = function(event) {
        this.pressed = false;

        this.options.startPosition = null;
    }.bind(this);

    this.touchstartEventListener = function(event) {
        touch = event.changedTouches[0];
        this.options.startPosition = touch.clientX;
        this.pressed = true;
    };

    this.touchmoveEventLinstener = function(event) {
        touch = event.changedTouches[0];
        if (this.pressed) {
            // console.info(this.getFrame(touch.clientX), this.options);
            return this.render(this.getFrame(touch.clientX));
        }
    };

    this.constructor.apply(this, arguments);
}