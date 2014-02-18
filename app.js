(function (document, PIXI, TweenMax, Ease) {
  var appHeight = 768,
      appWidth = 432,
      birdCounter = 0,
      radDown = Math.PI * .25,
      radUp = 0,
      pipeDown0 = new PIXI.Sprite(PIXI.Texture.fromImage('images/pipe-down.png')),
      pipeDown1 = new PIXI.Sprite(PIXI.Texture.fromImage('images/pipe-down.png')),
      pipeUp0 = new PIXI.Sprite(PIXI.Texture.fromImage('images/pipe-up.png')),
      pipeUp1 = new PIXI.Sprite(PIXI.Texture.fromImage('images/pipe-up.png')),
      pipeYMax = 360,
      pipeYMin = 45,
      renderer = new PIXI.autoDetectRenderer(appWidth, appHeight),
      spriteBg0 = new PIXI.Sprite(PIXI.Texture.fromImage('images/bg.png')),
      spriteBg1 = new PIXI.Sprite(PIXI.Texture.fromImage('images/bg.png')),
      stage = new PIXI.Stage(0xffffff),
      mcBird,
      pipes,
      pipesLength;

  document.body.appendChild(renderer.view);

  function addBg () {
    stage.addChild(spriteBg0);
    stage.addChild(spriteBg1);

    spriteBg1.x = spriteBg1.width;
  }

  function animateBg () {
    spriteBg0.x--;
    spriteBg1.x--;

    if (spriteBg1.x === 0) {
      spriteBg0.x = 0
      spriteBg1.x = spriteBg1.width;
    }
  }

  function addBird () {
    var spriteBird0 = PIXI.Texture.fromImage('images/flap0.png'),
        spriteBird1 = PIXI.Texture.fromImage('images/flap1.png'),
        spriteBird2 = PIXI.Texture.fromImage('images/flap2.png');

    mcBird = new PIXI.MovieClip([spriteBird0, spriteBird1, spriteBird2]);

    stage.addChild(mcBird);
    resetBird();
  }

  function animateBirdFlap () {
    mcBird.gotoAndStop(birdCounter++);

    if (birdCounter > 2) {
      birdCounter = 0;
    }
  }

  function animateBirdFall () {
    TweenMax.to(mcBird, 2, {
      y: 768,
      rotation: radDown,
      ease: Ease.easeIn,
      onComplete: resetBird
    });
  }

  function flapBird () {
    TweenMax.killTweensOf(mcBird);
    TweenMax.to(mcBird, .3, {
      y: '-=' + 50,
      rotation: radUp,
      ease: Ease.easeOut,
      onUpdate: limitBird,
      onComplete: animateBirdFall
    });
  }

  function limitBird () {
    if (mcBird.y < 0) {
      mcBird.y = 0;
    }
  }

  function resetBird () {
    mcBird.rotation = 0;
    mcBird.x = mcBird.y = -20;

    TweenMax.killTweensOf(mcBird);
    TweenMax.to(mcBird, .5, { x: 70, y: 70, ease: Ease.easeOut });

    animateBirdFall();
  }

  function addPipes () {
    stage.addChild(pipeDown0);
    stage.addChild(pipeDown1);
    stage.addChild(pipeUp0);
    stage.addChild(pipeUp1);

    pipeDown0.x = pipeUp0.x = appWidth;
    pipeDown1.x = pipeUp1.x = appWidth * 1.5;

    setRandomYForUpPipe(pipeUp0);
    setRandomYForUpPipe(pipeUp1);
    setRandomYForDownPipe(pipeDown0);
    setRandomYForDownPipe(pipeDown1);

    pipes = [pipeDown0, pipeDown1, pipeUp0, pipeUp1];
    pipesLength = pipes.length - 1;
  }

  function setRandomYForUpPipe (pipe) {
    pipe.y = getRandomNumber(appHeight - pipeYMax, appHeight - pipeYMin);
  }

  function setRandomYForDownPipe (pipe) {
    pipe.y = getRandomNumber(-pipeYMin, -pipeYMax);
  }

  function getRandomNumber(min, max) {
    console.log(min, max);
    return Math.random() * (max - min) + min;
  }

  function animatePipes () {
    var i,
        pipe;

    for (i = pipesLength; i >= 0; i--) {
      pipe = pipes[i];

      pipe.x--;

      if (pipe.x < -pipe.width) {
        pipe.x = appWidth;

        if (pipe === pipeUp0 || pipe === pipeUp1) {
          setRandomYForUpPipe(pipe);
        } else {
          setRandomYForDownPipe(pipe);
        }
      }
    };
  }

  function animate () {
    animateBg();
    animatePipes();

    renderer.render(stage);
    requestAnimFrame(animate);
  }

  addBg();
  addPipes();
  addBird();
  animateBirdFall();

  animate();

  setInterval(animateBirdFlap, 100);

  document.addEventListener('click', flapBird);
  document.addEventListener('tapstart', flapBird);
})(document, PIXI, TweenMax, Sine);