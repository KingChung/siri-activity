;
(function() {
    function Canvas(opts) {
        this.canvas;
        var ctx;
        var WIDTH;
        var HEIGHT;
        var PARENT;

        this.params = function() {
            return {
                "width": WIDTH,
                "height": HEIGHT,
                "ctx": ctx
            }
        }

        this.circle = function(x, y, r, c) {
            ctx.beginPath();
            ctx.fillStyle = c;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0
            ctx.shadowBlur = 24;
            ctx.shadowColor = "rgba(255,231,254,0.9)";
            ctx.arc(x, y, r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }

        this.clear = function() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            //ctx.width = WIDTH;
        }

        function init() {
            this.canvas = document.createElement("canvas");
            ctx = this.canvas.getContext("2d");
            this.canvas.id = opts.id;
            this.canvas.width = opts.width;
            this.canvas.height = opts.height;
            WIDTH = opts.width;
            HEIGHT = opts.height;
            PARENT = opts.parent;
            $(PARENT).append(this.canvas);
        }

        init();
    }

    $(document).ready(function() {
        var angle = 0,
            particle = 0,
            siriAnimating = false,
            opacity = 1,
            totalParticles = 80,
            drawTimer;
        var colors = ["rgba(255,231,254,0.4)", "rgba(154,34,147,0.4)", "rgba(246,1,232,0.4)"];

        function draw() {
            var p = pulse.params();
            if (!siriAnimating) {
                opacity *= 0.90;
                p.ctx.globalAlpha = opacity;
                if (opacity <= 0.1) {
                    pulse.clear();
                    p.ctx.globalAlpha = 1;
                    clearTimeout(drawTimer);
                    opacity = 1;
                    particle = 0;
                    angle = 0;
                    return;
                }
            }

            var acceleration = particle * .001;
            p.ctx.globalCompositeOperation = 'lighter';
            pulse.clear();
            for (var segments = 0; segments <= particle + 1; segments++) {
                x = p.width / 2 + 91 * Math.cos((angle - (segments * 0.01)) * Math.PI)
                y = p.height / 2 + 91 * Math.sin((angle - (segments * 0.01)) * Math.PI)
                var size = (!siriAnimating) ? 0.15 : 0.07;
                //colors[~~Math.random()*(colors.length)]
                pulse.circle(x, y, ((particle + 1) - segments) * size, colors[~~Math.random() * (colors.length)]);
            }
            if (particle < totalParticles) {
                particle++;
            }
            angle = angle <= 2 ? ((particle > 30) ? angle = angle + 0.03 : angle = angle + 0.01 + acceleration) : 0;
            drawTimer = setTimeout(draw, 10);
        }

        function drawMicPulse() {

        }

        pulse = new Canvas({
            width: 250,
            height: 250,
            id: "pulse",
            parent: ".siri"
        });
        mic = new Canvas({
            width: 67,
            height: 108,
            id: "mic",
            parent: ".siri .brapper"
        });

        $(".siri").click(function() {
            if (siriAnimating) {
                siriAnimating = false;
            } else {
                siriAnimating = true;
                draw();
            }
        });

        //Begin 
        var $siri = $('.siri'), $ss = $('#audio')[0];
        setTimeout(function() {
            $('[data-type="siri"]').eq(0).fadeIn(function() {
                $siri.click();
                $ss.play();
                setTimeout(function() {
                    $('[data-type="owner"]').eq(0).fadeIn(function() {
                        $siri.click();

                        setTimeout(function() {
                            $('[data-type="siri"]').eq(1).fadeIn(function() {
                                var that = this,
                                    _time = 12;
                                $siri.click();
                                (function loading() {
                                    if (!_time--) return;
                                    var hiddenDot = $(that).find('._dot:hidden').eq(0);
                                    if (hiddenDot.length) {
                                        hiddenDot.fadeIn(function() {
                                            setTimeout(loading, 500);
                                        });
                                    } else {
                                        $(that).find('._dot').hide();
                                        loading();
                                    }
                                })();
                                setTimeout(function() {
                                    $siri.click();
                                    $ss.play();
                                    $(that).fadeOut(function() {
                                        $('[data-type="siri"]').eq(2).fadeIn(function() {
                                            setTimeout(function() {
                                                $('[data-type="siri"]').eq(3).slideDown(function() {
                                                    setTimeout(function() {
                                                        $('.finger').show();
                                                    }, 3e3);
                                                });
                                            }, 1e3);
                                        });
                                    });
                                }, 4e3);
                            });
                        }, 1e3);
                    });
                }, 1e3);
            });
        }, 1e3);
    });
})();
