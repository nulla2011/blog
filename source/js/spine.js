const spineDir = '/spine/';
const idleMaxTime = 60000;
const edge = 40;
class SpineModel {
  constructor(config) {
    this.config = config;
    this.model = config.models[Math.floor(Math.random() * config.models.length)];
    this.urlPrefix = spineDir + this.model.name;
    this.skin = this.model.skin;
    this.json = this.urlPrefix + '/data.json';
    this.atlas = this.urlPrefix + '/data.atlas';
    this.widget = null;
    this.widgetElement = document.querySelector('.spine-widget');
    this.triggerEvents = ['mousedown', 'touchstart', 'scroll'];
    this.lastInteractTime = Date.now();
    this.localX = 0;
    this.localY = 0;
    this.load();
  }
  load() {
    for (const key in this.config.styles.widget) {
      this.widgetElement.style.setProperty(key, this.config.styles.widget[key]);
    }
    new spine.SpineWidget(this.widgetElement, {
      animation: this.model.animations.start,
      atlas: this.atlas,
      json: this.json,
      skin: this.skin,
      backgroundColor: '#00000000',
      loop: !1,
      success: this.successCallback.bind(this),
    });
  }
  successCallback(w) {
    // let ev = () => {
    //   this.triggerEvents.forEach((i) => window.removeEventListener(i, ev));
    //   this.initWidgetActions();
    //   // this.initDragging();
    //   this.widget.play();
    //   this.widgetElement.style.display = 'block';
    // };
    this.widget = w;
    this.initWidgetActions();
    this.initDragging();
    this.triggerEvents.forEach((i) =>
      window.addEventListener(i, this.changeIdleAnimation.bind(this))
    );
    // this.widget.pause();
    // this.widgetElement.style.display = 'none';
    // this.triggerEvents.forEach((i) => window.addEventListener(i, ev));
  }
  initWidgetActions() {
    this.widget.canvas.onclick = this.interact.bind(this);
    this.widget.state.addListener({
      complete: (t) => {
        t.loop || this.isIdle()
          ? this.playRandAnimation({
              name: t.animation.name,
              loop: !0,
            })
          : this.playRandAnimation(this.getAnimationList('idle'));
      },
    });
  }
  isIdle() {
    let currentAnm = this.widget.state.tracks[0].animation;
    for (const i of this.getAnimationList('idle')) {
      if (currentAnm.name === i.name) {
        return !0;
      }
    }
    return !1;
  }
  playRandAnimation(anm) {
    if (Array.isArray(anm)) {
      let a = anm[Math.floor(Math.random() * anm.length)];
      this.widget.state.setAnimation(0, a.name, a.loop);
    } else {
      this.widget.state.setAnimation(0, anm.name, anm.loop);
    }
  }
  getAnimationList(name) {
    return this.model.animations[name].map((n) => ({
      name: n,
      loop: !1,
    }));
  }
  interact() {
    !this.isIdle()
      ? console.warn('too much manipulations')
      : ((this.lastInteractTime = Date.now()),
        this.playRandAnimation(
          this.widget.skeleton.data.animations.map((n) => ({
            name: n.name,
            loop: !1,
          }))
        ));
  }
  changeIdleAnimation() {
    let time = Date.now(),
      interval = time - this.lastInteractTime;
    if (this.isIdle() && interval >= idleMaxTime) {
      (this.lastInteractTime = time), this.playRandAnimation(this.getAnimationList('idle'));
    }
  }
  initDragging() {
    function i(t) {
      var e = document.documentElement.scrollLeft,
        i = document.documentElement.scrollTop;
      return (
        t.targetTouches
          ? ((e += t.targetTouches[0].clientX), (i += t.targetTouches[0].clientY))
          : t.clientX && t.clientY && ((e += t.clientX), (i += t.clientY)),
        {
          x: e,
          y: i,
        }
      );
    }
    function e(t) {
      t.cancelable && t.preventDefault();
    }
    var n = (t, e) => {
        (t = Math.max(0 - edge, t)),
          (e = Math.max(0, e)),
          (t = Math.min(document.body.clientWidth + edge - this.widgetElement.clientWidth, t)),
          (e = Math.min(document.body.clientHeight - this.widgetElement.clientHeight, e)),
          (this.widgetElement.style.left = t + 'px'),
          (this.widgetElement.style.top = e + 'px');
      },
      o = (t) => {
        var { x: e, y: t } = i(t);
        (this.localX = e - this.widgetElement.offsetLeft),
          (this.localY = t - this.widgetElement.offsetTop);
      },
      s = (t) => {
        var { x: e, y: t } = i(t);
        n(e - this.localX, t - this.localY),
          window.getSelection
            ? window.getSelection().removeAllRanges()
            : document.selection.empty();
      },
      t = {
        passive: !0,
      },
      a = {
        passive: !1,
      };
    this.widgetElement.addEventListener('mousedown', (t) => {
      o(t), document.addEventListener('mousemove', s);
    }),
      this.widgetElement.addEventListener(
        'touchstart',
        (t) => {
          o(t), document.addEventListener('touchmove', e, a);
        },
        t
      ),
      this.widgetElement.addEventListener('touchmove', s, t),
      document.addEventListener('mouseup', () => document.removeEventListener('mousemove', s)),
      this.widgetElement.addEventListener('touchend', () =>
        document.removeEventListener('touchmove', e)
      ),
      window.addEventListener('resize', () => {
        let t = this.widgetElement.style;
        var e, i;
        t.left &&
          t.top &&
          ((e = Number.parseInt(t.left.substring(0, t.left.length - 2))),
          (i = Number.parseInt(t.top.substring(0, t.top.length - 2))),
          n(e, i));
      });
  }
}
