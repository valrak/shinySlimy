var windowManager = {};

function WindowManager() {
  this.windows = new Map();
  this.lastWindow = [];
  this.order = [];

  this.putInOrder = function(name) {
    if (this.order.indexOf(name) !== -1) {
      this.order.splice(this.order.indexOf(name), 1);
      this.order.push(name);
    }
    else {
      this.order.push(name);
    }
  };

  this.getNextInOrder = function() {

    if (this.order.length > 0) {
      return this.order[this.order.length - 1];
    }
    else {
      return null;
    }
  };

  this.removeFromOrder = function(name) {
    if (typeof this.order.indexOf(name) !== -1) {
      this.order.splice(this.order.indexOf(name), 1);
    }
  };

  this.register = function(name, windowObject) {
    if (!(this.windows.has(name))) {
      this.putInOrder(name);
      this.windows.set(name, windowObject);
      this.putBehindExcept(name);
      return true;
    }
    else {
      // reopen new window (as it can be opened with new parameters)
      if (typeof this.windows.get(name).remoteClose == 'function') {
        this.windows.get(name).remoteClose();
      }
      this.windows.set(name, windowObject);
      this.putInOrder(name);
      this.putBehindExcept(name);
    }
  };

    this.putBehindExcept = function(name) {
        for (let active of this.windows) {
          // correct object to put to top
            if (active[0] !== name) {
              this.setWindow(active[0], false);
            }
        }
      };

  this.setWindow = function(name, active) {
    if (active !== false) {
      this.putInOrder(name);
    }
    // find objects in windows map
    if (this.windows.has(name)) {
      if (typeof this.windows.get(name).setActive == 'function') {
        this.windows.get(name).setActive(active);
      }
    }
  };

  this.unregister = function(name) {
    this.windows.delete(name);
    this.removeFromOrder(name);
    if (this.windows.size > 0) {
      this.setWindow(this.getNextInOrder(), true);
    }
  };
  
}
