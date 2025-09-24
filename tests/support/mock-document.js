class MockTextNode {
  constructor(text, document) {
    this.nodeType = 3;
    this.textContent = text;
    this.ownerDocument = document;
  }
}

class MockStyle {
  constructor() {
    this.properties = new Map();
  }

  setProperty(name, value) {
    this.properties.set(name, String(value));
  }

  getPropertyValue(name) {
    return this.properties.get(name) ?? "";
  }
}

class MockElement {
  constructor(tagName, document) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = document;
    this.children = [];
    this.attributes = new Map();
    this.dataset = {};
    this.style = new MockStyle();
    this._textContent = "";
    this.className = "";
    this.value = "";
    this.parentNode = null;
    this.listeners = new Map();
  }

  append(...nodes) {
    nodes.forEach((node) => this.appendChild(node));
  }

  appendChild(node) {
    if (node === null || node === undefined) {
      return;
    }

    if (typeof node === "string") {
      node = new MockTextNode(node, this.ownerDocument);
    }

    if (node.nodeType === 3) {
      this.children.push(node);
    } else {
      node.parentNode = this;
      this.children.push(node);
    }
  }

  createEvent(type) {
    return { type, target: this };
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  getAttribute(name) {
    return this.attributes.get(name);
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }

  removeEventListener(type, handler) {
    if (!handler) {
      this.listeners.delete(type);
      return;
    }
    const current = this.listeners.get(type);
    if (current === handler) {
      this.listeners.delete(type);
    }
  }

  dispatchEvent(event) {
    const handler = this.listeners.get(event.type);
    if (handler) {
      handler.call(this, event);
    }
  }

  set innerHTML(value) {
    this.children = [];
    this._textContent = value;
  }

  get innerHTML() {
    if (this.children.length) {
      return this.children.map((child) => child.textContent ?? "").join("");
    }
    return this._textContent;
  }

  set textContent(value) {
    this.children = [];
    this._textContent = value;
  }

  get textContent() {
    if (this.children.length) {
      return this.children
        .map((child) => (child.nodeType === 3 ? child.textContent : child.textContent))
        .join("");
    }
    return this._textContent;
  }
}

export const createMockDocument = () => {
  const elements = new Map();

  const documentElement = new MockElement("html", null);

  const document = {
    title: "",
    documentElement,
    register(selector, element) {
      element.ownerDocument = document;
      elements.set(selector, element);
      return element;
    },
    querySelector(selector) {
      return elements.get(selector) ?? null;
    },
    createElement(tag) {
      return new MockElement(tag, document);
    },
    createTextNode(text) {
      return new MockTextNode(text, document);
    },
    defaultView: {
      getComputedStyle() {
        return { getPropertyValue: () => "" };
      }
    }
  };

  documentElement.ownerDocument = document;

  return document;
};

export { MockElement, MockStyle };
