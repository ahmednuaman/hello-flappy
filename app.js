(function (document, PIXI, TweenMax, Ease) {
  var birdCounter = 0,
      radDown = Math.PI * .25,
      radUp = -radDown,
      renderer = new PIXI.autoDetectRenderer(432, 768),
      spriteBg1 = new PIXI.Sprite(PIXI.Texture.fromImage('images/bg.png')),
      spriteBg2 = new PIXI.Sprite(PIXI.Texture.fromImage('images/bg.png')),
      stage = new PIXI.Stage(0xffffff),
      mcBird;

  document.body.appendChild(renderer.view);

  function addBg () {
    stage.addChild(spriteBg1);
    stage.addChild(spriteBg2);

    spriteBg2.x = spriteBg2.width;
  }

  function animateBg () {
    spriteBg1.x--;
    spriteBg2.x--;

    if (spriteBg2.x === 0) {
      spriteBg1.x = 0
      spriteBg2.x = spriteBg2.width;
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
    TweenMax.to(mcBird, 1.5, {
      y: 768,
      rotation: radDown,
      ease: Ease.easeIn,
      onComplete: resetBird
    });
  }

  function flapBird () {
    TweenMax.killTweensOf(mcBird);
    TweenMax.to(mcBird, .25, {
      y: '-=' + 100,
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

  function animate () {
    animateBg();

    renderer.render(stage);
    requestAnimFrame(animate);
  }

  addBg();
  addBird();
  animateBirdFall();

  animate();

  setInterval(animateBirdFlap, 100);

  document.addEventListener('click', flapBird);
  document.addEventListener('tapstart', flapBird);
})(document, PIXI, TweenMax, Sine);