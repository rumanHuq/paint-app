(function () {
  class Paint {
    constructor() {
      this.onInputChange();
      this.onButtonClick();
      this.canvas = document.querySelector('canvas.main');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.height = window.innerHeight - 100;
      this.canvas.width = window.innerWidth - 100;
      this.canvas.addEventListener('mousedown', this.dragStart.bind(this));
      this.canvas.addEventListener('mousemove', this.drag.bind(this));
      this.canvas.addEventListener('mouseup', this.dragStop.bind(this));

      this.state = {
        dragging: false,
        initialPointer: {},
        snapshot: {}
      };
      this.profile = {
        color: '',
        text: '',
        shape: 'rectangle'
      };
    }
    onWindowResize () {
      this.canvas.height = window.innerHeight - 100;
      this.canvas.width = window.innerWidth - 100;
    }
    onInputChange () {
      const input = document.querySelectorAll('input');
      const events = 'keyup change'.split(' ');
      input.forEach(elem => {
        events.forEach(event => {
          elem.addEventListener(event, e => {
            if (elem.getAttribute('type') == 'color') this.profile.color = e.target.value;
            if (elem.getAttribute('type') == 'text') {
              this.profile.text = e.target.value;
              this.makeText();
            }
          });
        });
      });
    }
    onButtonClick () {
      const self = this;
      const btns = document.querySelectorAll('button');
      btns.forEach(btn => {
        btn.addEventListener('click', function () {
          const shape = this.getAttribute('data-shape');
          self.profile.shape = shape;
        });
      });
    }
    // Mouse Events
    dragStart (e) {
      this.state.dragging = true;
      // getting ctx.moveTo() initial coord
      this.state.initialPointer = this.getCoord(e);
      this.takeSnapShot();
    }
    drag (e) {
      if (this.state.dragging) {
        this.restoreSnapShopt();
        switch (this.profile.shape) {
          case ('ellipse'):
            this.makeEllipse(this.getCoord(e));
            break;

          case ('circle'):
            this.makeCircle(this.getCoord(e));
            break;
          case ('square'):
            this.makeRectangle(this.getCoord(e));
            break;
          case ('rectangle'):
            this.makeRectangle(this.getCoord(e));
            break;
          default:
            this.makeRectangle(this.getCoord(e));
        }
      }
    }
    dragStop () {
      this.state.dragging = false;

    }

    // Initialize co-ordinate within Canvas
    getCoord (e) {
      const x = e.clientX - this.canvas.getBoundingClientRect().left;
      const y = e.clientY - this.canvas.getBoundingClientRect().top;
      return {
        x, y
      };
    }

    // SAVE and RESTORE the CANVAS STATE
    takeSnapShot () {
      return this.state.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    restoreSnapShopt () {
      this.ctx.putImageData(this.state.snapshot, 0, 0);
    }

    // SHAPES
    makeCircle (currentPointer) {
      // https://www.mathsisfun.com/algebra/circle-equations.html x²+y²=r²; r= Math.sqrt(x²+y²)
      const radius = Math.sqrt(Math.pow((this.state.initialPointer.x - currentPointer.x), 2) +
        Math.pow((this.state.initialPointer.y - currentPointer.y), 2));
      this.ctx.beginPath();
      this.ctx.arc(this.state.initialPointer.x, this.state.initialPointer.y, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = this.profile.color;
      this.ctx.fill();
    }

    makeEllipse (currentPointer) {
      const radius = Math.sqrt(Math.pow((this.state.initialPointer.x - currentPointer.x), 2) +
        Math.pow((this.state.initialPointer.y - currentPointer.y), 2));
      this.ctx.beginPath();
      this.ctx.ellipse(
        this.state.initialPointer.x,
        this.state.initialPointer.y,
        radius,
        radius + radius / 2,
        Math.PI,
        0,
        2 * Math.PI
      );
      this.ctx.fillStyle = this.profile.color;
      this.ctx.fill();
    }

    makeRectangle (currentPointer) {
      this.ctx.fillStyle = this.profile.color;
      this.ctx.fillRect(
        this.state.initialPointer.x,
        this.state.initialPointer.y,
        - this.state.initialPointer.x + currentPointer.x,
        //either rectangle or square
        this.profile.shape == 'square' ? - this.state.initialPointer.x + currentPointer.x : - this.state.initialPointer.y + currentPointer.y
      );
    }

    makeText () {
      const canvas = document.querySelector('canvas.text');
      canvas.style.left = this.canvas.getBoundingClientRect().left + 15 + 'px';
      canvas.height = 100;
      canvas.width = window.innerWidth - 100;
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '40pt Arial';
      ctx.fillStyle = this.profile.color;
      ctx.fillText(this.profile.text, 0, 40);
    }
  }
  const paint = new Paint();
  window.addEventListener('resize', paint.onWindowResize.bind(paint));
}());

