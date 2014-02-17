(function (document, PIXI) {
  var renderer = new PIXI.autoDetectRenderer(432, 768),
      spriteBg1 = new PIXI.Sprite(PIXI.Texture.fromImage('images/bg.png')),
      spriteBg2 = new PIXI.Sprite(PIXI.Texture.fromImage('images/bg.png')),
      stage = new PIXI.Stage(0xffffff);

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

  function animate () {
    animateBg();

    renderer.render(stage);
    requestAnimFrame(animate);
  }

  addBg();
  animate();
})(document, PIXI);